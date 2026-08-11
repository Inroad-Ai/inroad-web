/** Mirrors the `companies.stage` CHECK constraint; update both together. */
export const PIPELINE_STAGES = [
  "researched",
  "contacted",
  "responded",
  "interviewing",
  "closed",
  "rejected",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const STAGE_LABEL: Record<PipelineStage, string> = {
  researched: "Researched",
  contacted: "Contacted",
  responded: "Responded",
  interviewing: "Interviewing",
  closed: "Closed",
  rejected: "Rejected",
};

// Amber is reserved for the page's one primary action, so "closed" uses ochre.
const STAGE_TONE: Record<PipelineStage, string> = {
  researched: "border-line bg-surface-raised text-text-secondary",
  contacted: "border-signal-teal/40 bg-signal-teal-subtle text-signal-teal",
  responded: "border-signal-teal/40 bg-signal-teal-subtle text-signal-teal",
  interviewing: "border-success/40 bg-success-subtle text-success",
  closed: "border-warning/40 bg-warning-subtle text-warning",
  rejected: "border-muted-rose/40 bg-muted-rose-subtle text-muted-rose",
};

export function StatusBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={`utility-label inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 ${STAGE_TONE[stage]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {STAGE_LABEL[stage]}
    </span>
  );
}
