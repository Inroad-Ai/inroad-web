import { PERSON_STAGES, type PersonStage } from "@/lib/types";

export { PERSON_STAGES, type PersonStage };

export const PERSON_STAGE_LABEL: Record<PersonStage, string> = {
  found: "Found",
  contacted: "Contacted",
  replied: "Replied",
  closed: "Closed",
};

const PERSON_STAGE_TONE: Record<PersonStage, string> = {
  found: "border-line bg-surface-raised text-text-secondary",
  contacted: "border-signal-teal/40 bg-signal-teal-subtle text-signal-teal",
  replied: "border-success/40 bg-success-subtle text-success",
  closed: "border-warning/40 bg-warning-subtle text-warning",
};

export function PersonStageBadge({ stage }: { stage: PersonStage }) {
  return (
    <span
      className={`utility-label inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 ${PERSON_STAGE_TONE[stage]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {PERSON_STAGE_LABEL[stage]}
    </span>
  );
}
