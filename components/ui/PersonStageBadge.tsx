import { PERSON_STAGES, type PersonStage } from "@/lib/types";

import { Badge, type BadgeTone } from "./Badge";

export { PERSON_STAGES, type PersonStage };

export const PERSON_STAGE_LABEL: Record<PersonStage, string> = {
  found: "Found",
  contacted: "Contacted",
  replied: "Replied",
  closed: "Closed",
};

const PERSON_STAGE_TONE: Record<PersonStage, BadgeTone> = {
  found: "neutral",
  contacted: "teal",
  replied: "success",
  closed: "warning",
};

export function PersonStageBadge({ stage }: { stage: PersonStage }) {
  return (
    <Badge tone={PERSON_STAGE_TONE[stage]} dot>
      {PERSON_STAGE_LABEL[stage]}
    </Badge>
  );
}
