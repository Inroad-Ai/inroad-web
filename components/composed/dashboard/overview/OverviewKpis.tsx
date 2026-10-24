import type { OverviewStats } from "@/lib/types";

import { KpiCard } from "./KpiCard";
import type { OverviewMetrics } from "./overview-metrics";

function OutreachDelta({ delta }: { delta: number }) {
  if (delta === 0) return <>No change from the prior period</>;
  return (
    <>
      <span className={delta > 0 ? "font-sans-semibold text-success" : "font-sans-semibold"}>
        {delta > 0 ? "+" : ""}
        {delta}
      </span>{" "}
      from the prior period
    </>
  );
}

export function OverviewKpis({
  stats,
  metrics,
}: {
  stats: OverviewStats;
  metrics: OverviewMetrics;
}) {
  return (
    <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-3">
      <KpiCard
        label="Companies saved"
        value={stats.total_companies}
        context="Across your full search"
      />
      <KpiCard
        label={`Outreach, last ${stats.contacted_window_days} days`}
        value={stats.contacted_within_window}
        context={<OutreachDelta delta={metrics.outreachDelta} />}
      />
      <KpiCard
        label="Still in research"
        value={metrics.researched}
        context={`${metrics.researchedShare}% ready for your next move`}
      />
    </section>
  );
}
