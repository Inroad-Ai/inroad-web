import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DEMO_COMPANIES } from "@/lib/landing/ask-companies";

const FACTS = [
  {
    quote: "“...moving the write path from Elixir to Go cut p99 latency by 70%...”",
    url: "ledgerline.com/engineering/go-write-path",
  },
  {
    quote: "“The new money goes first into a ledger platform team...”",
    url: "ledgerline.com/blog/series-b",
  },
] as const;

export function MatchesVisual() {
  return (
    <>
      {DEMO_COMPANIES.slice(0, 3).map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-3 rounded-nest bg-surface px-3 py-2.5 shadow-nest"
        >
          <CompanyLogo logoUrl={null} seed={c.domain} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-sans-bold text-ink">{c.name}</p>
            <p className="text-xs text-ink-muted">{c.reasons.role}</p>
          </div>
          <span className="ml-auto text-xl font-sans-semibold tracking-display text-ink">
            {c.fit}
          </span>
        </div>
      ))}
      <p className="px-1 pt-1 text-sm font-sans-semibold text-ink-muted">
        and 9 more, each with the reasons spelled out
      </p>
    </>
  );
}

export function FactsVisual() {
  return (
    <>
      {FACTS.map((fact) => (
        <div key={fact.url} className="px-2 py-3">
          <p className="text-lg text-ink">{fact.quote}</p>
          <p className="mt-1.5 text-xs font-sans-semibold text-signal-teal">{fact.url}</p>
        </div>
      ))}
    </>
  );
}

export function DraftVisual() {
  return (
    <>
      <Card padding="none" className="px-4 shadow-nest">
        {[
          ["To", "Elena Petrova · Gridlight"],
          ["Subject", "Market data ingestion at Gridlight"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex gap-3 border-b border-line py-2.5 text-sm last:border-b-0"
          >
            <span className="w-14 shrink-0 text-ink-muted">{label}</span>
            <b className="font-sans-bold text-ink">{value}</b>
          </div>
        ))}
      </Card>
      <p className="mx-0.5 mt-1.5 text-sm text-ink-muted">
        Congrats on signing 1.2 GW this year. I saw the Senior Backend Engineer, Market Data role
        and the note about sub-second ingestion across 9 exchanges...
      </p>
    </>
  );
}
