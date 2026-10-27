"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { ApiError, streamResearchCompanyDomain } from "@/lib/api-client/client";
import type { ResearchPhase, ResearchProgressEvent, ResearchSource } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { CardState, SourceState } from "@/lib/types";

export interface ResearchRun {
  id: number;
  domain: string;
  state: CardState;
  companyId: string | null;
  error: string | null;
  phase: ResearchPhase | null;
  sources: Record<ResearchSource, SourceState>;
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
  startResearch: (domain: string, options?: { refresh?: boolean }) => number;
}

const ResearchRunsContext = createContext<ResearchRunsContextValue | null>(null);

let nextRunId = 0;

// Bounded so a long session doesn't grow this list forever - same reasoning
// as the backend's own history cap.
const MAX_TRACKED_RUNS = 20;

// A dropped stream (network blip, API restart) is re-opened: the backend
// finishes research in its worker and replays the progress from the start.
const RECONNECT_ATTEMPTS = 6;
const RECONNECT_DELAY_MS = 3000;

// Minimum time each phase (and the final result) stays on screen. A cached
// run streams every phase within milliseconds, so without this the bar would
// flash from empty to done instead of animating.
const MIN_PHASE_MS = 400;

function droppedStream(error: unknown): boolean {
  return !(error instanceof ApiError) || error.status === 0;
}

export function ResearchRunsProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<ResearchRun[]>([]);

  const startResearch = useCallback(
    (domain: string, options: { refresh?: boolean } = {}): number => {
      const id = nextRunId++;
      const run: ResearchRun = {
        id,
        domain,
        state: "pending",
        companyId: null,
        error: null,
        phase: null,
        sources: { homepage: "idle", news: "idle", hiring: "idle", people: "idle" },
      };
      setRuns((prev) => [run, ...prev].slice(0, MAX_TRACKED_RUNS));

      function settle(update: Partial<ResearchRun>) {
        setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
      }

      (async () => {
        // Pace visible updates so phases arriving back to back (a cached run)
        // still animate one after another instead of flashing past.
        let pacing = Promise.resolve();
        let lastPacedAt = 0;
        const pace = (apply: () => void): Promise<void> => {
          pacing = pacing.then(async () => {
            const wait = MIN_PHASE_MS - (Date.now() - lastPacedAt);
            if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
            lastPacedAt = Date.now();
            apply();
          });
          return pacing;
        };

        try {
          const token = await ensureValidAccessToken();
          if (!token) {
            settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
            return;
          }
          const onProgress = (event: ResearchProgressEvent) => {
            if (event.type === "phase") {
              pace(() => settle({ phase: event.phase }));
            } else {
              setRuns((prev) =>
                prev.map((run) =>
                  run.id === id
                    ? { ...run, sources: { ...run.sources, [event.source]: event.status } }
                    : run,
                ),
              );
            }
          };
          // Only a stream the backend marked resumable is re-opened.
          let resumable = false;
          const streamOptions = { ...options, onResumable: () => (resumable = true) };
          for (let attempt = 0; ; attempt++) {
            try {
              const companyId = await streamResearchCompanyDomain(
                domain,
                token,
                onProgress,
                streamOptions,
              );
              // Let the last phase finish its minimum dwell before the report
              // replaces the progress bar.
              await pace(() => settle({ state: "done", companyId }));
              return;
            } catch (error) {
              if (attempt + 1 >= RECONNECT_ATTEMPTS || !resumable || !droppedStream(error)) {
                throw error;
              }
              await new Promise((resolve) => setTimeout(resolve, RECONNECT_DELAY_MS));
            }
          }
        } catch (error) {
          await pace(() =>
            settle({
              state: "failed",
              error:
                error instanceof ApiError
                  ? error.message
                  : "Research stopped unexpectedly. Please try again.",
            }),
          );
        }
      })();

      return id;
    },
    [],
  );

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
