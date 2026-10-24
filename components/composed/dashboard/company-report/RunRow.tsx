import { formatTimestamp, totalTimeSeconds } from "@/lib/format";
import type { ResearchRunSummary } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function RunRow({ run }: { run: ResearchRunSummary }) {
  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-sans-semibold text-ink">
          {formatTimestamp(run.created_at)}
        </span>
        <span className="utility-label shrink-0 text-ink-faint">
          {totalTimeSeconds(run.elapsed_ms)}s
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {run.partial ? <Badge tone="rose">Partial</Badge> : <Badge tone="neutral">Complete</Badge>}
        <Badge tone={run.from_cache ? "amber" : "teal"}>{run.from_cache ? "Cached" : "Live"}</Badge>
      </div>
    </li>
  );
}
