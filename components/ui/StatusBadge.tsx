/**
 * The stage vocabulary for a company moving through outreach. No pipeline
 * schema exists yet (Companies/Pipeline aren't built), so this list is a
 * reasonable default, not something read from the backend. Update it in one
 * place, here, once the real pipeline model lands.
 */
export const PIPELINE_STAGES = [
  "researching",
  "ready_to_reach_out",
  "reached_out",
  "replied",
  "interviewing",
  "offer",
  "passed",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

const STAGE_LABEL: Record<PipelineStage, string> = {
  researching: "Researching",
  ready_to_reach_out: "Ready to reach out",
  reached_out: "Reached out",
  replied: "Replied",
  interviewing: "Interviewing",
  offer: "Offer",
  passed: "Passed",
};

// Amber is reserved for the page's one primary action, so it never appears
// here even for "offer" — warning (ochre) is the closest distinct positive.
const STAGE_TONE: Record<PipelineStage, string> = {
  researching: "border-line bg-surface-raised text-text-secondary",
  ready_to_reach_out: "border-signal-teal/40 bg-signal-teal-subtle text-signal-teal",
  reached_out: "border-signal-teal/40 bg-signal-teal-subtle text-signal-teal",
  replied: "border-success/40 bg-success-subtle text-success",
  interviewing: "border-success/40 bg-success-subtle text-success",
  offer: "border-warning/40 bg-warning-subtle text-warning",
  passed: "border-muted-rose/40 bg-muted-rose-subtle text-muted-rose",
};

/**
 * The one stage-badge treatment, reused on the companies table, the
 * pipeline board, and the company profile header. Keep it here so all
 * three stay visually identical instead of drifting apart.
 */
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
