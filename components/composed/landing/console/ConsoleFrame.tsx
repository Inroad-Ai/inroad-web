import type { ReactNode } from "react";

import { LockIcon, ReplayIcon } from "@/components/ui/Icons";

/** Browser chrome around the console, with the Replay control. */
export function ConsoleFrame({
  onReplay,
  children,
}: {
  onReplay: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-card bg-surface shadow-pop">
      <div className="flex h-11 items-center gap-3 border-b border-line bg-ink/5 px-4">
        <div aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          ))}
        </div>
        <div className="mx-auto flex h-7 min-w-0 items-center gap-2 rounded-sm bg-surface-raised px-3 font-mono text-2xs text-ink-muted">
          <LockIcon className="h-3 w-3" />
          <span className="truncate">app.inroad.so/ask</span>
        </div>
        <button
          type="button"
          onClick={onReplay}
          className="utility-label inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-ink/15 bg-surface px-2.5 text-ink-muted transition-colors duration-fast hover:text-ink"
        >
          <ReplayIcon className="h-3 w-3" />
          <span className="hidden sm:inline">Replay demo</span>
          <span className="sm:hidden">Replay</span>
        </button>
      </div>
      <div className="grid h-console grid-rows-1 md:grid-cols-console">{children}</div>
    </div>
  );
}
