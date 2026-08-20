import { totalTimeSeconds } from "@/lib/format";
import type { CompanyDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

import { HomepageSummary } from "./HomepageSummary";
import { NewsSummary } from "./NewsSummary";
import { PartialRunNotice } from "./PartialRunNotice";

export function LatestResearchSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;

  if (research === null) {
    return (
      <Section title="Latest research">
        <EmptyState>
          Nothing saved for this company yet. Run research again to fill this in.
        </EmptyState>
      </Section>
    );
  }

  return (
    <Section
      title="Latest research"
      meta={
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={research.from_cache ? "amber" : "teal"}>
            {research.from_cache ? "Served from cache" : "Fetched live"}
          </Badge>
          <span className="utility-label text-text-secondary/70">
            {totalTimeSeconds(research.elapsed_ms)}s
          </span>
        </div>
      }
    >
      {/* A partial run is still a 200 with nulls in it. Say so plainly rather
          than letting the empty fields below read as "nothing to report". */}
      {research.partial ? <PartialRunNotice errors={research.errors} /> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <HomepageSummary homepage={research.homepage} />
        <NewsSummary news={research.news} />
      </div>
    </Section>
  );
}
