import { Stat } from "@/components/ui/Stat";

import type { OverviewMetrics } from "../overview/overview-metrics";

export function TodayAside({
  saved,
  fittingRoles,
  metrics,
}: {
  saved: number;
  fittingRoles: number | null;
  metrics: OverviewMetrics;
}) {
  return (
    <aside className="flex flex-col gap-8 border-line xl:border-l xl:pl-9">
      <Stat value={saved} label="Companies saved" />
      {fittingRoles ? <Stat value={fittingRoles} label="Roles that fit you" /> : null}
      {metrics.outreachBase > 0 ? (
        <Stat value={`${metrics.responseRate}%`} label="Response rate" />
      ) : null}
      <Stat value={metrics.added} label="Added in the last 12 weeks" />
    </aside>
  );
}
