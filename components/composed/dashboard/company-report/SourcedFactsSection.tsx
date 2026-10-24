import type { CompanyDetail, CompanySignal, SourcedFact, SourcedPerson } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { safeHref } from "@/lib/safe-href";

function factText(fact: SourcedFact): string {
  const { text, name, description } = fact.value as Record<string, unknown>;
  if (typeof text === "string") return text;
  if (typeof name === "string") {
    return typeof description === "string" ? `${name}: ${description}` : name;
  }
  return JSON.stringify(fact.value);
}

function label(factType: string): string {
  return factType.replaceAll("_", " ");
}

const LINK = "break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4";

function SignalsList({ signals }: { signals: CompanySignal[] }) {
  return (
    <div className="mt-6">
      <p className="utility-label font-sans-semibold text-text-secondary">
        Company news &amp; signals
      </p>
      {signals.length === 0 ? (
        <EmptyState className="mt-2">
          Nothing dated was found on the company&apos;s own news, press or blog pages.
        </EmptyState>
      ) : (
        <ul className="mt-2 space-y-4">
          {signals.map((signal, index) => (
            <li key={`${signal.url}-${index}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{label(signal.signal_type)}</Badge>
                {signal.date ? (
                  <span className="text-xs text-text-secondary">
                    {signal.date_kind === "event" ? "" : "published "}
                    {signal.date}
                  </span>
                ) : null}
              </div>
              <a
                href={safeHref(signal.url) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 block text-sm ${LINK}`}
              >
                {signal.title}
              </a>
              {signal.excerpt ? (
                <blockquote className="mt-1 border-l-2 border-line pl-3 text-sm text-text-secondary">
                  &ldquo;{signal.excerpt}&rdquo;
                </blockquote>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PeopleList({ people }: { people: SourcedPerson[] }) {
  if (people.length === 0) return null;
  return (
    <div className="mt-6">
      <p className="utility-label font-sans-semibold text-text-secondary">
        People listed on the company&apos;s site
      </p>
      <ul className="mt-2 space-y-2">
        {people.map((person, index) => (
          <li key={`${person.name}-${index}`} className="text-sm text-ink">
            {person.name}
            {person.title ? <span className="text-text-secondary">, {person.title}</span> : null}
            {person.page_url ? (
              <>
                {" "}
                <a
                  href={safeHref(person.page_url) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  source
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    <Section
      title="Sourced facts"
      meta={
        <Badge tone="neutral">
          {`${facts.length} facts, ${signals.length} signals, ${people.length} people, ${sources.length} pages`}
        </Badge>
      }
    >
      {facts.length === 0 ? (
        <EmptyState>No facts were extracted from the pages this run fetched.</EmptyState>
      ) : (
        <ul className="space-y-5">
          {facts.map((fact, index) => (
            <li key={`${fact.fact_type}-${index}`}>
              <p className="utility-label font-sans-semibold text-text-secondary">
                {label(fact.fact_type)}
              </p>
              <p className="mt-1 text-sm text-ink">{factText(fact)}</p>
              {fact.evidence.map((item, i) => (
                <blockquote
                  key={i}
                  className="mt-2 border-l-2 border-line pl-3 text-sm text-text-secondary"
                >
                  &ldquo;{item.excerpt}&rdquo;{" "}
                  <a
                    href={safeHref(item.source_url) ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
                  >
                    {item.source_url}
                  </a>
                </blockquote>
              ))}
            </li>
          ))}
        </ul>
      )}

      {newsCollected ? <SignalsList signals={signals} /> : null}
      <PeopleList people={people} />

      <div className="mt-6">
        <p className="utility-label font-sans-semibold text-text-secondary">Pages fetched</p>
        {sources.length === 0 ? (
          <EmptyState className="mt-2">No pages came back with this run.</EmptyState>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {sources.map((source) => (
              <li key={source.url} className="text-sm text-ink">
                <Badge tone="neutral">{source.page_type}</Badge>{" "}
                <a
                  href={safeHref(source.url) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
                >
                  {source.title ?? source.url}
                </a>
                {source.acquired_via === "olostep" ? (
                  <span className="ml-2 text-text-secondary">via Olostep</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
