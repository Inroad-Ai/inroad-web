import { totalTimeSeconds } from "@/lib/format";
import type { CompanyDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

import { DashboardPanel } from "../DashboardPanel";
import { NewsSummary } from "./NewsSummary";

export function LatestResearchSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;

  if (research === null) {
    return (
      <DashboardPanel title="Latest research">
        <EmptyState>
          Nothing saved for this company yet. Run research again to fill this in.
        </EmptyState>
      </DashboardPanel>
    );
  }

  return (
    <DashboardPanel
      title="Latest research"
      meta={
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={research.from_cache ? "amber" : "teal"}>
            {research.from_cache ? "Served from cache" : "Fetched live"}
          </Badge>
          <span className="utility-label text-ink-faint">
            {totalTimeSeconds(research.elapsed_ms)}s
          </span>
        </div>
      }
    >
      <NewsSummary
        news={research.news}
        notCollected={"news" in (research.not_collected ?? {})}
        firstPartyOnly={research.research_backend === "sourcing"}
      />
    </DashboardPanel>
  );
}
