"use client";

import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { elapsedTimingLabel } from "@/lib/match-scan";

export function MatchElapsedStatus({ startedAt }: { startedAt: number }) {
  const elapsedSeconds = useElapsedSeconds(startedAt);

  return (
    <p className="mt-3 text-xs text-ink-muted" role="status" aria-live="polite">
      Match scan is running. {elapsedTimingLabel(elapsedSeconds)}
    </p>
  );
}
