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

/** Polls a pipeline run until it completes or fails (or `until` says it has
 * gone far enough), reporting each poll. Resolves with that run, or null once
 * the poll budget runs out first. Request errors and an abort reject. */
export async function followRun<T extends PipelineRunOut>(
  fetchRun: (signal?: AbortSignal) => Promise<T>,
  {
    intervalMs,
    maxAttempts,
    signal,
    onPoll,
    until,
  }: {
    intervalMs: number;
    maxAttempts: number;
    signal?: AbortSignal;
    onPoll?: (run: T) => void;
    until?: (run: T) => boolean;
  },
): Promise<T | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const run = await fetchRun(signal);
    onPoll?.(run);
    if (!isRunActive(run.status) || until?.(run)) return run;
    await wait(intervalMs, signal);
    signal?.throwIfAborted();
  }
  return null;
}
