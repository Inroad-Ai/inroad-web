import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ProgressBar, type ProgressTone } from "@/components/ui/ProgressBar";

import { DashboardPanel } from "../DashboardPanel";
import type { FunnelRow, FunnelStage } from "./overview-metrics";

// Same tone per stage as StatusBadge, so a stage reads the same everywhere.
const STAGE_TONE: Record<FunnelStage, ProgressTone> = {
  researched: "faint",
  contacted: "teal",
  responded: "teal",
  interviewing: "success",
  closed: "warning",
};

export function PipelineFunnel({ funnel, active }: { funnel: FunnelRow[]; active: number }) {
  const largest = Math.max(1, ...funnel.map((row) => row.count));

  return (
    <DashboardPanel
      eyebrow="Current position"
      title="Pipeline funnel"
      description="Companies by current stage. Rejected ones are left out."
      meta={<Badge tone="teal">{active} active</Badge>}
    >
      <ul className="grid gap-3.5" aria-label={`${active} companies are active in the pipeline.`}>
        {funnel.map((row) => (
          <li key={row.stage} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 font-sans-semibold text-ink">{row.label}</span>
            <ProgressBar
              value={row.count / largest}
              tone={STAGE_TONE[row.stage]}
              thick
              className="min-w-0 flex-1"
            />
            <span className="w-8 shrink-0 text-right font-mono text-ink tabular-nums">
              {row.count}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-4">
        <Button
          href="/companies/pipeline"
          variant="ghost"
          size="sm"
          icon={<ArrowRightIcon />}
          iconPosition="end"
          className="-ml-4"
        >
          Open the pipeline
        </Button>
      </div>
    </DashboardPanel>
  );
}
