import { Stat } from "@/components/ui/Stat";
import { plural } from "@/lib/format";

import type { OverviewMetrics } from "../overview/overview-metrics";

const SHOWN_STAGES = ["researched", "contacted", "responded", "interviewing"];

export function TodayPipeline({ metrics, waiting }: { metrics: OverviewMetrics; waiting: number }) {
  const rows = metrics.funnel.filter((row) => SHOWN_STAGES.includes(row.stage));
  const sentences = [
    metrics.outreachBase > 0
      ? `Response rate ${metrics.responseRate}%.`
      : "Reach out to your first company to start tracking replies.",
    waiting > 0 ? `${plural(waiting, "company is", "companies are")} waiting on you.` : null,
  ].filter(Boolean);

  return (
    <div className="pt-3">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {rows.map((row) => (
          <Stat key={row.stage} value={row.count} label={row.label} />
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-muted">{sentences.join(" ")}</p>
    </div>
  );
}
