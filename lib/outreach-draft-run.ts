import { getOutreachDraftRun } from "@/lib/api-client/client";
import { followRun } from "@/lib/run-polling";
import type { OutreachDraftRunResult } from "@/lib/types";

// About 90 seconds in all: past the slowest drafts seen, short of leaving a
// spinner up forever.
const DRAFT_POLL_INTERVAL_MS = 2000;
const DRAFT_POLL_MAX_ATTEMPTS = 45;

/** Polls a draft run until it settles; null once the poll budget runs out
 * while it is still going. */
export function followOutreachDraftRun(
  personId: string,
  runId: string,
  token: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<OutreachDraftRunResult | null> {
  return followRun((poll) => getOutreachDraftRun(personId, runId, token, poll), {
    intervalMs: DRAFT_POLL_INTERVAL_MS,
    maxAttempts: DRAFT_POLL_MAX_ATTEMPTS,
    signal,
  });
}
