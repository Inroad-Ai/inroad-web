"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

import { ApiError, fetchCompany, streamResearchCompanyDomain } from "@/lib/api-client/client";
import type { ResearchPhase, ResearchSource } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { CardState } from "@/lib/types";

export interface ResearchRun {
  id: number;
  domain: string;
  state: CardState;
  companyId: string | null;
  partial: boolean | null;
  error: string | null;
  phase: ResearchPhase | null;
  sources: Record<ResearchSource, CardState>;
}

interface ResearchRunsContextValue {
  runs: ResearchRun[];
  canStartResearch: (domain: string) => boolean;
  /** Fires the request and tracks it here rather than in the caller's own
   * state, so it keeps updating after the caller unmounts - the backend
   * already runs research to completion regardless of navigation (it can
   * take 20-35s+), the frontend just used to throw away all trace of it
   * the moment the page that started it unmounted. Returns the run's id so
   * a caller that wants to react to its own run's outcome can find it in
   * `runs` without picking up someone else's run for the same domain. Returns
   * null when this domain is already running or all three slots are in use. */
  startResearch: (domain: string) => number | null;
}

const ResearchRunsContext = createContext<ResearchRunsContextValue | null>(null);

let nextRunId = 0;

// Bounded so a long session doesn't grow this list forever - same reasoning
// as the backend's own history cap.
const MAX_TRACKED_RUNS = 20;
export const MAX_CONCURRENT_RESEARCH_RUNS = 3;

export function ResearchRunsProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<ResearchRun[]>([]);
  const pendingDomains = useRef(new Map<number, string>());

  const canStartResearch = useCallback((domain: string): boolean => {
    const normalized = domain.trim().toLowerCase();
    return (
      normalized.length > 0 &&
      pendingDomains.current.size < MAX_CONCURRENT_RESEARCH_RUNS &&
      !Array.from(pendingDomains.current.values()).includes(normalized)
    );
  }, []);

  const startResearch = useCallback(
    (domain: string): number | null => {
      if (!canStartResearch(domain)) return null;
      const normalized = domain.trim().toLowerCase();
      const id = nextRunId++;
      pendingDomains.current.set(id, normalized);
      const run: ResearchRun = {
        id,
        domain: normalized,
        state: "pending",
        companyId: null,
        partial: null,
        error: null,
        phase: null,
        sources: { homepage: "idle", news: "idle", hiring: "idle" },
      };
      setRuns((prev) => {
        const next = [run, ...prev.filter((item) => item.domain !== normalized)];
        const activeCount = next.filter((item) => item.state === "pending").length;
        const settled = next.filter((item) => item.state !== "pending");
        const retained = new Set(settled.slice(0, MAX_TRACKED_RUNS - activeCount));
        return next.filter((item) => item.state === "pending" || retained.has(item));
      });

      function settle(update: Partial<ResearchRun>) {
        if (update.state === "done" || update.state === "failed") {
          pendingDomains.current.delete(id);
        }
        setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
      }

      (async () => {
        try {
          const token = await ensureValidAccessToken();
          if (!token) {
            settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
            return;
          }
          const companyId = await streamResearchCompanyDomain(normalized, token, (event) => {
            if (event.type === "phase") {
              settle({ phase: event.phase });
            } else {
              setRuns((prev) =>
                prev.map((run) =>
                  run.id === id
                    ? { ...run, sources: { ...run.sources, [event.source]: event.status } }
                    : run,
                ),
              );
            }
          });
          settle({ state: "done", companyId });
          try {
            const company = await fetchCompany(companyId, token);
            settle({ partial: company.latest_research?.partial ?? null });
          } catch {
            // The brief is saved even if its detail request fails.
          }
        } catch (error) {
          settle({
            state: "failed",
            error:
              error instanceof ApiError
                ? error.message
                : "Research stopped unexpectedly. Please try again.",
          });
        }
      })();

      return id;
    },
    [canStartResearch],
  );

  return (
    <ResearchRunsContext.Provider value={{ runs, canStartResearch, startResearch }}>
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
