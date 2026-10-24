import { getMatchRun } from "@/lib/api-client/client";
import type { MatchRunResult } from "@/lib/types";

// About two minutes in all: past the slowest scans seen, short of leaving a spinner up forever.
const MATCH_POLL_INTERVAL_MS = 3000;
const MATCH_POLL_MAX_ATTEMPTS = 40;

/** The backend's usual match scan time, quoted in the UI. */
const USUAL_SCAN_MIN_SECONDS = 20;
const USUAL_SCAN_MAX_SECONDS = 35;
export const USUAL_SCAN_RANGE = `${USUAL_SCAN_MIN_SECONDS} to ${USUAL_SCAN_MAX_SECONDS} seconds`;

export function isMatchRunActive(status: MatchRunResult["status"]): boolean {
  return status === "pending" || status === "running";
}

export function elapsedTimingLabel(elapsedSeconds: number): string {
  return elapsedSeconds > USUAL_SCAN_MAX_SECONDS
    ? `${elapsedSeconds}s elapsed, taking longer than usual`
    : `${elapsedSeconds}s elapsed, usually ${USUAL_SCAN_RANGE}`;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => window.clearTimeout(timer), { once: true });
  });
}

/** Polls a match run until it completes or fails, reporting each poll. Resolves
 * with the settled run, or null once the poll budget runs out while the run is
 * still going. Request errors and an abort reject. */
export async function followMatchRun(
  runId: string,
  token: string,
  { signal, onPoll }: { signal?: AbortSignal; onPoll?: (run: MatchRunResult) => void } = {},
): Promise<MatchRunResult | null> {
  for (let attempt = 0; attempt < MATCH_POLL_MAX_ATTEMPTS; attempt++) {
    const run = await getMatchRun(runId, token, signal);
    onPoll?.(run);
    if (!isMatchRunActive(run.status)) return run;
    await wait(MATCH_POLL_INTERVAL_MS, signal);
    signal?.throwIfAborted();
  }
  return null;
}
