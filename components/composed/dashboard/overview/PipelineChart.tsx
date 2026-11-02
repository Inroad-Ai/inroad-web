import { DashboardPanel } from "../DashboardPanel";
import type { FunnelRow } from "./overview-metrics";
import { RankedBars } from "./RankedBars";

/** Every saved company by stage, in pipeline order. */
export function PipelineChart({ funnel, total }: { funnel: FunnelRow[]; total: number }) {
  return (
    <DashboardPanel
      className="h-full"
      title="Pipeline"
      description={`Where your ${total} ${total === 1 ? "company stands" : "companies stand"}.`}
    >
      <RankedBars
        rows={funnel.map((row) => ({ key: row.stage, label: row.label, value: row.count }))}
        valueName="Companies"
        ariaLabel={funnel.map((row) => `${row.label}: ${row.count}`).join(", ")}
      />
    </DashboardPanel>
  );
}
