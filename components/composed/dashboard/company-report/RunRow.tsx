import { formatTimestamp, totalTimeSeconds } from "@/lib/format";
import type { ResearchRunSummary } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function RunRow({ run }: { run: ResearchRunSummary }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <span className="text-sm text-ink">{formatTimestamp(run.created_at)}</span>
      <span className="flex flex-wrap items-center gap-3">
        {run.partial ? <Badge tone="rose">Partial</Badge> : <Badge tone="neutral">Complete</Badge>}
        <span className="utility-label text-text-secondary/70">
          {totalTimeSeconds(run.elapsed_ms)}s
        </span>
      </span>
    </li>
  );
}
