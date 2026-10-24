import { ProgressBar } from "@/components/ui/ProgressBar";

/** One thin segment per phase, filling as its steps are reached, with the step count beside it. */
export function PhaseProgress({
  phases,
  fills,
  currentPhaseIndex,
  step,
  total,
}: {
  phases: readonly string[];
  fills: readonly number[];
  currentPhaseIndex: number;
  step: number;
  total: number;
}) {
  const currentPhase = phases[currentPhaseIndex];
  const stepLabel = `Step ${step} of ${total}`;

  return (
    <div
      role="progressbar"
      aria-label="Setup progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={currentPhase ? `${stepLabel}, ${currentPhase}` : stepLabel}
      className="flex min-w-0 items-center gap-4 sm:items-start"
    >
      <div className="flex min-w-0 flex-1 gap-1.5">
        {phases.map((phase, index) => (
          <div key={phase} className="grid min-w-0 flex-1 gap-2">
            <ProgressBar value={fills[index] ?? 0} />
            <span
              className={`utility-label hidden truncate sm:block ${
                index === currentPhaseIndex ? "text-ink" : "text-ink-faint"
              }`}
            >
              {phase}
            </span>
          </div>
        ))}
      </div>
      <span className="whitespace-nowrap font-mono sm:-mt-1.5 text-xs text-ink-muted">
        {stepLabel}
      </span>
    </div>
  );
}
