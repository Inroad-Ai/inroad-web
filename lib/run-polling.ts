import type { PipelineRunOut, PipelineRunStatus } from "@/lib/types";

export function isRunActive(status: PipelineRunStatus): boolean {
  return status === "pending" || status === "running";
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => window.clearTimeout(timer), { once: true });
  });
}

/** Polls a pipeline run until it completes or fails, reporting each poll.
 * Resolves with the settled run, or null once the poll budget runs out while
 * the run is still going. Request errors and an abort reject. */
export async function followRun<T extends PipelineRunOut>(
  fetchRun: (signal?: AbortSignal) => Promise<T>,
  {
    intervalMs,
    maxAttempts,
    signal,
    onPoll,
  }: {
    intervalMs: number;
    maxAttempts: number;
    signal?: AbortSignal;
    onPoll?: (run: T) => void;
  },
): Promise<T | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const run = await fetchRun(signal);
    onPoll?.(run);
    if (!isRunActive(run.status)) return run;
    await wait(intervalMs, signal);
    signal?.throwIfAborted();
  }
  return null;
}
