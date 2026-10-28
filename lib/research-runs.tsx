"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { ApiError, streamResearchCompanyDomain } from "@/lib/api-client/client";
import type { ResearchPhase, ResearchProgressEvent, ResearchSource } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { phaseIndex } from "@/lib/research-phases";
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

// Minimum time each phase stays on screen before the next phase or the
// outcome replaces it. A cached run streams every phase within milliseconds,
// so without this the bar would flash from empty to done instead of animating.
const MIN_PHASE_MS = 400;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type Enqueue = (apply: () => void, options?: { dwell?: boolean }) => Promise<void>;

/** Applies one run's updates in arrival order. An update with `dwell` waits
 * until the phase before it has been on screen for MIN_PHASE_MS; the rest
 * (source results) only keep their place in line. No waiting at all for
 * someone who asked for reduced motion: there is nothing to watch. */
function createProgressQueue(): Enqueue {
  const dwellMs = window.matchMedia(REDUCED_MOTION_QUERY).matches ? 0 : MIN_PHASE_MS;
  let queue = Promise.resolve();
  let phaseShownAt = 0;
  return (apply, { dwell = false } = {}) => {
    queue = queue.then(async () => {
      const wait = dwell ? dwellMs - (Date.now() - phaseShownAt) : 0;
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      if (dwell) phaseShownAt = Date.now();
      apply();
    });
    return queue;
  };
}

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
        const enqueue = createProgressQueue();
        // A reconnect replays progress from the start; only a phase past the
        // furthest one reached moves the bar, so it never rewinds.
        let reached = phaseIndex(null);

        try {
          const token = await ensureValidAccessToken();
          if (!token) {
            settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
            return;
          }
          const onProgress = (event: ResearchProgressEvent) => {
            if (event.type === "phase") {
              const index = phaseIndex(event.phase);
              if (index <= reached) return;
              reached = index;
              void enqueue(() => settle({ phase: event.phase }), { dwell: true });
            } else {
              void enqueue(() =>
                setRuns((prev) =>
                  prev.map((run) =>
                    run.id === id
                      ? { ...run, sources: { ...run.sources, [event.source]: event.status } }
                      : run,
                  ),
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
              await enqueue(() => settle({ state: "done", companyId }), { dwell: true });
              return;
            } catch (error) {
              if (attempt + 1 >= RECONNECT_ATTEMPTS || !resumable || !droppedStream(error)) {
                throw error;
              }
              await new Promise((resolve) => setTimeout(resolve, RECONNECT_DELAY_MS));
            }
          }
        } catch (error) {
          // Queued too, so a failure never lands ahead of progress already in line.
          await enqueue(() =>
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
