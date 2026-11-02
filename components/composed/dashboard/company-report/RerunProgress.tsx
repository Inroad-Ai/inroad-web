import type { ResearchRun } from "@/lib/research-runs";

import { ResearchSteps } from "../research/ResearchSteps";

/** Where a re-run is: the same live steps as the Research page. */
export function RerunProgress({ run }: { run: ResearchRun }) {
  return <ResearchSteps run={run} />;
}
