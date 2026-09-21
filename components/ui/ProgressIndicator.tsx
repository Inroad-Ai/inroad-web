import { CheckCircleIcon } from "@/components/ui/Icons";

/** Phase labels (which section am I in) plus a thin fill bar underneath (how
 * far along overall) - a raw "Step X of N" answers neither question as
 * directly as naming the section does. currentPhaseIndex of -1 means no
 * phase has started yet (the welcome screen), so nothing is highlighted. */
export function ProgressIndicator({
  step,
  total,
  phases,
  currentPhaseIndex,
}: {
  step: number;
  total: number;
  phases: readonly string[];
  currentPhaseIndex: number;
}) {
  // "welcome" (step 1 of total) is an intro, not form progress - counting it
  // would start the bar at a jump instead of 0%, and end a step early.
  const percent = total > 1 ? Math.round(((step - 1) / (total - 1)) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {phases.map((phase, index) => (
          <span key={phase} className="flex items-center gap-1.5">
            {index < currentPhaseIndex ? (
              <span className="text-signal-teal" aria-hidden="true">
                <CheckCircleIcon />
              </span>
            ) : null}
            <span
              aria-current={index === currentPhaseIndex ? "step" : undefined}
              className={`utility-label ${
                index === currentPhaseIndex
                  ? "font-semibold text-signal-teal"
                  : index < currentPhaseIndex
                    ? "text-text-secondary"
                    : "text-text-secondary/40"
              }`}
            >
              {phase}
            </span>
            {index < phases.length - 1 ? (
              <span className="text-text-secondary/40" aria-hidden="true">
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-signal-amber transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
