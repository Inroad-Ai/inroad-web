import { getLatestMatchRun, getMatchRun } from "@/lib/api-client/client";
import { followRun, isRunActive } from "@/lib/run-polling";
import type { MatchRunResult } from "@/lib/types";

// About two minutes in all: past the slowest scans seen, short of leaving a spinner up forever.
// The first match is saved before its research, so a short interval shows it promptly.
const MATCH_POLL_INTERVAL_MS = 1500;
const MATCH_POLL_MAX_ATTEMPTS = 80;
// Research of five companies runs in parallel, a few minutes at most.
const RESEARCH_PROGRESS_INTERVAL_MS = 3000;
const RESEARCH_PROGRESS_MAX_ATTEMPTS = 120;

/** The backend's usual match scan time, quoted in the UI. */
const USUAL_SCAN_MIN_SECONDS = 20;
const USUAL_SCAN_MAX_SECONDS = 35;
export const USUAL_SCAN_RANGE = `${USUAL_SCAN_MIN_SECONDS} to ${USUAL_SCAN_MAX_SECONDS} seconds`;

export const isMatchRunActive = isRunActive;

export function elapsedTimingLabel(elapsedSeconds: number): string {
  return elapsedSeconds > USUAL_SCAN_MAX_SECONDS
    ? `${elapsedSeconds}s elapsed, taking longer than usual`
    : `${elapsedSeconds}s elapsed, usually ${USUAL_SCAN_RANGE}`;
}

/** Polls a match run until it settles (or `until` holds), reporting each
 * poll; null once the poll budget runs out while it is still going. */
export function followMatchRun(
  runId: string,
  token: string,
  {
    signal,
    onPoll,
    until,
  }: {
    signal?: AbortSignal;
    onPoll?: (run: MatchRunResult) => void;
    until?: (run: MatchRunResult) => boolean;
  } = {},
): Promise<MatchRunResult | null> {
  return followRun((poll) => getMatchRun(runId, token, poll), {
    intervalMs: MATCH_POLL_INTERVAL_MS,
    maxAttempts: MATCH_POLL_MAX_ATTEMPTS,
    signal,
    onPoll,
    until,
  });
}

/** The caller's newest match run, followed until its research is done. */
export function followLatestMatchRun(
  token: string,
  { signal, onPoll }: { signal?: AbortSignal; onPoll?: (run: MatchRunResult) => void } = {},
): Promise<MatchRunResult | null> {
  return followRun((poll) => getLatestMatchRun(token, poll), {
    intervalMs: RESEARCH_PROGRESS_INTERVAL_MS,
    maxAttempts: RESEARCH_PROGRESS_MAX_ATTEMPTS,
    signal,
    onPoll,
  });
}
