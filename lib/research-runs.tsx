"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { ApiError, researchCompanyDomain } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { CardState } from "@/lib/types";

export interface ResearchRun {
  id: number;
  domain: string;
  state: CardState;
  /** Actual client-side start time, used to show elapsed time while the
   * synchronous research request is pending. */
  startedAt: number;
  companyId: string | null;
  error: string | null;
}

interface ResearchRunsContextValue {
  runs: ResearchRun[];
  /** Fires the request and tracks it here rather than in the caller's own
   * state, so it keeps updating after the caller unmounts - the backend
   * already runs research to completion regardless of navigation (it can
   * take 20-35s+), the frontend just used to throw away all trace of it
   * the moment the page that started it unmounted. Returns the run's id so
   * a caller that wants to react to its own run's outcome can find it in
   * `runs` without picking up someone else's run for the same domain. */
  startResearch: (domain: string) => number;
}

const ResearchRunsContext = createContext<ResearchRunsContextValue | null>(null);

let nextRunId = 0;

// Bounded so a long session doesn't grow this list forever - same reasoning
// as the backend's own history cap.
const MAX_TRACKED_RUNS = 20;

export function ResearchRunsProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<ResearchRun[]>([]);

  const startResearch = useCallback((domain: string): number => {
    const id = nextRunId++;
    setRuns((prev) =>
      [
        {
          id,
          domain,
          state: "pending" as CardState,
          startedAt: Date.now(),
          companyId: null,
          error: null,
        },
        ...prev,
      ].slice(
        0,
        MAX_TRACKED_RUNS,
      ),
    );

    function settle(update: Partial<ResearchRun>) {
      setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
    }

    (async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
          return;
        }
        const company = await researchCompanyDomain(domain, token);
        settle({ state: "done", companyId: company.id });
      } catch (error) {
        settle({
          state: "failed",
          error:
            error instanceof ApiError
              ? error.message
              : "Something went wrong before the check could run.",
        });
      }
    })();

    return id;
  }, []);

  return (
    <ResearchRunsContext.Provider value={{ runs, startResearch }}>
      {children}
    </ResearchRunsContext.Provider>
  );
}

export function useResearchRuns(): ResearchRunsContextValue {
  const ctx = useContext(ResearchRunsContext);
  if (!ctx) {
    throw new Error("useResearchRuns must be used within a ResearchRunsProvider");
  }
  return ctx;
}
