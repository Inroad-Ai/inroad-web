import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ResearchPhase } from "@/lib/api-client/client";

import { PHASE_COUNT, phaseIndex } from "./research-progress";

/** One segment per research phase: done ones full, the current one half and pulsing. */
export function ResearchPhaseBar({ phase }: { phase: ResearchPhase | null }) {
  const reached = phaseIndex(phase);

  return (
    <div aria-hidden className="flex gap-1.5">
      {Array.from({ length: PHASE_COUNT }, (_, index) => (
        <ProgressBar
          key={index}
          value={index < reached ? 1 : index === reached ? 0.5 : 0}
          pulse={index === reached}
          className="flex-1"
        />
      ))}
    </div>
  );
}
