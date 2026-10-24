import type { ResearchRun } from "@/lib/research-runs";

import { phaseLabel } from "../research/research-progress";
import { ResearchPhaseBar } from "../research/ResearchPhaseBar";

/** Where a re-run is: the same phase label and bar as the Research page. */
export function RerunProgress({ run }: { run: ResearchRun }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2.5">
      <p className="text-sm font-sans-semibold text-ink">{phaseLabel(run.phase)}</p>
      <ResearchPhaseBar phase={run.phase} />
    </div>
  );
}
