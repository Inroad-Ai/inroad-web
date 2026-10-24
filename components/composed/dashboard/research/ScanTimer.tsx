"use client";

import { SpinnerIcon } from "@/components/ui/Icons";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";

/** Visual only: the scan's row in the list below announces progress to
 * screen readers, so this one stays silent rather than announce twice. */
export function ScanTimer({ startedAt }: { startedAt: number }) {
  const elapsedSeconds = useElapsedSeconds(startedAt);

  return (
    <div
      aria-hidden
      className="mt-4 flex items-center gap-3 rounded-nest bg-surface-raised px-4 py-3"
    >
      <span className="inline-flex text-signal-amber">
        <SpinnerIcon />
      </span>
      <span className="min-w-0 flex-1 text-sm font-sans-semibold text-ink">
        Scanning against your profile
      </span>
      <span className="font-mono text-sm text-ink tabular-nums">{elapsedSeconds}s</span>
    </div>
  );
}
