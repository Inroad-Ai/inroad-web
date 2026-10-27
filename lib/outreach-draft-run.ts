import { getOutreachDraftRun } from "@/lib/api-client/client";
import type { OutreachDraftRunResult } from "@/lib/types";

// About 90 seconds in all: past the slowest drafts seen, short of leaving a
// spinner up forever.
const DRAFT_POLL_INTERVAL_MS = 2000;
const DRAFT_POLL_MAX_ATTEMPTS = 45;

export function isDraftRunActive(status: OutreachDraftRunResult["status"]): boolean {
  return status === "pending" || status === "running";
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => window.clearTimeout(timer), { once: true });
  });
}

/** Polls a draft run until it completes or fails. Resolves with the settled
 * run, or null once the poll budget runs out while it is still going.
 * Request errors and an abort reject. */
export async function followOutreachDraftRun(
  personId: string,
  runId: string,
  token: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<OutreachDraftRunResult | null> {
  for (let attempt = 0; attempt < DRAFT_POLL_MAX_ATTEMPTS; attempt++) {
    const run = await getOutreachDraftRun(personId, runId, token, signal);
    if (!isDraftRunActive(run.status)) return run;
    await wait(DRAFT_POLL_INTERVAL_MS, signal);
    signal?.throwIfAborted();
  }
  return null;
}
