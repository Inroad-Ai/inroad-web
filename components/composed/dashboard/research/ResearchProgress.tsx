import { SpinnerIcon } from "@/components/ui/Icons";
import type { ResearchRun } from "@/lib/research-runs";

import { phaseLabel, RESEARCH_SOURCES, sourceState, sourceStatusLabel } from "./research-progress";
import { ResearchPhaseBar } from "./ResearchPhaseBar";
import { StatusIcon } from "./StatusIcon";

const SOURCE_TINT = {
  done: "bg-signal-teal-subtle",
  failed: "bg-error-subtle",
} as const;

/** The live view of one run: the phase it's in, then each source's state. */
export function ResearchProgress({ run }: { run: ResearchRun }) {
  return (
    <div className="mt-6 border-t border-line pt-5" role="status" aria-live="polite">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex text-signal-amber">
          <SpinnerIcon />
        </span>
        <p className="min-w-0 flex-1 text-sm font-sans-semibold text-ink">
          {phaseLabel(run.phase)}
        </p>
        <p className="font-mono text-xs text-ink-muted">{run.domain}</p>
      </div>

      <div className="mt-4">
        <ResearchPhaseBar phase={run.phase} />
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {RESEARCH_SOURCES.map(({ key, label, description }) => {
          const state = sourceState(run, key);
          const tint =
            state === "done" || state === "failed" ? SOURCE_TINT[state] : "bg-surface-raised";
          return (
            <li key={key} className={`rounded-nest p-4 transition-colors duration-base ${tint}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-sans-bold text-ink">{label}</span>
                <StatusIcon state={state} />
              </div>
              <p className="mt-1.5 text-xs text-ink-muted">{description}</p>
              <p className="utility-label mt-3 text-ink-faint">{sourceStatusLabel(state)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
