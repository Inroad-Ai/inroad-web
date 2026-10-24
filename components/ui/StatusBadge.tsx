import { PIPELINE_STAGES, type PipelineStage } from "@/lib/types";

import { Badge, type BadgeTone } from "./Badge";

export { PIPELINE_STAGES, type PipelineStage };

export const STAGE_LABEL: Record<PipelineStage, string> = {
  researched: "Researched",
  contacted: "Contacted",
  responded: "Responded",
  interviewing: "Interviewing",
  closed: "Closed",
  rejected: "Rejected",
};

// Amber is reserved for the page's one primary action, so "closed" uses ochre.
const STAGE_TONE: Record<PipelineStage, BadgeTone> = {
  researched: "neutral",
  contacted: "teal",
  responded: "teal",
  interviewing: "success",
  closed: "warning",
  rejected: "rose",
};

export function StatusBadge({ stage }: { stage: PipelineStage }) {
  return (
    <Badge tone={STAGE_TONE[stage]} dot>
      {STAGE_LABEL[stage]}
    </Badge>
  );
}
