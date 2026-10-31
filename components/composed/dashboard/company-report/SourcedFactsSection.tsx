import type { CompanyDetail } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { EvidenceQuote } from "./EvidenceQuote";
import { factText, humanize } from "./fact-labels";

/** What the company says about itself, each with the page line behind it.
 * Nothing renders when research found no facts. */
export function SourcedFactsSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research?.research_backend !== "sourcing") return null;
  const facts = research.facts ?? [];
  if (facts.length === 0) return null;

  return (
    <DashboardPanel title="Highlights">
      <ul className="grid gap-3 md:grid-cols-2">
        {facts.map((fact, index) => (
          <Card
            as="li"
            key={`${fact.fact_type}-${index}`}
            variant="nested"
            padding="sm"
            className="flex flex-col gap-3"
          >
            <div>
              <Eyebrow as="h3">{humanize(fact.fact_type)}</Eyebrow>
              <p className="mt-1.5 text-sm font-sans-semibold leading-relaxed text-ink">
                {factText(fact)}
              </p>
            </div>
            {fact.evidence.slice(0, 1).map((item, i) => (
              <EvidenceQuote key={i} url={item.source_url} excerpt={item.excerpt} />
            ))}
          </Card>
        ))}
      </ul>
    </DashboardPanel>
  );
}
