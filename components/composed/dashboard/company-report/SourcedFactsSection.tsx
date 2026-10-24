import type { CompanyDetail } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { EvidenceQuote } from "./EvidenceQuote";
import { factText, humanize } from "./fact-labels";
import { PagesFetchedList } from "./PagesFetchedList";
import { SignalsList } from "./SignalsList";
import { SourcedPeopleList } from "./SourcedPeopleList";

/** Facts from the sourcing backend, each with the page excerpts behind it.
 * Renders nothing for dossiers from the legacy pipeline, which has no facts. */
export function SourcedFactsSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research?.research_backend !== "sourcing") return null;
  const facts = research.facts ?? [];
  const sources = research.sources ?? [];
  const signals = research.signals ?? [];
  const people = research.sourced_people ?? [];
  const newsCollected = !("news" in (research.not_collected ?? {})) && !("news" in research.errors);

  return (
    <DashboardPanel
      title="Sourced facts"
      meta={
        <span className="utility-label text-ink-muted">
          {`${facts.length} facts, ${signals.length} signals, ${people.length} people, ${sources.length} pages`}
        </span>
      }
    >
      {facts.length === 0 ? (
        <EmptyState>No facts were extracted from the pages this run fetched.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
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
              {fact.evidence.map((item, i) => (
                <EvidenceQuote key={i} url={item.source_url} excerpt={item.excerpt} />
              ))}
            </Card>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-col gap-8">
        {newsCollected ? <SignalsList signals={signals} /> : null}
        <SourcedPeopleList people={people} />
        <PagesFetchedList sources={sources} />
      </div>
    </DashboardPanel>
  );
}
