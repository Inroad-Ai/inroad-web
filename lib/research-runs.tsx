"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { ApiError, getResearchRun, researchCompanyDomain } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { CardState } from "@/lib/types";

const RESEARCH_POLL_INTERVAL_MS = 3000;
const RESEARCH_POLL_MAX_ATTEMPTS = 40;

export interface ResearchRun {
  id: number;
  domain: string;
  state: CardState;
  /** Actual client-side start time, used to show elapsed time while the
   * background research run is in progress. */
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
      ].slice(0, MAX_TRACKED_RUNS),
    );

    function settle(update: Partial<ResearchRun>) {
      setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
    }

    async function poll(runId: string, token: string, attempt = 0) {
      try {
        const result = await getResearchRun(runId, token);
        if (result.status === "completed") {
          settle({ state: "done", companyId: result.company_id });
          return;
        }
        if (result.status === "failed") {
          settle({
            state: "failed",
            error: result.error ?? "Research could not complete.",
          });
          return;
        }
        if (attempt + 1 >= RESEARCH_POLL_MAX_ATTEMPTS) {
          settle({
            state: "failed",
            error: "This is taking longer than expected. Check back on it shortly.",
          });
          return;
        }
        setTimeout(() => void poll(runId, token, attempt + 1), RESEARCH_POLL_INTERVAL_MS);
      } catch (error) {
        settle({
          state: "failed",
          error: error instanceof ApiError ? error.message : "Lost track of this run's progress.",
        });
      }
    }

    (async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
          return;
        }
        const run = await researchCompanyDomain(domain, token);
        settle({ companyId: run.company_id });
        void poll(run.id, token);
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
