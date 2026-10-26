import type { CompanySignal } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatMonth } from "@/lib/format";

import { ExternalLink } from "./ExternalLink";
import { humanize } from "./fact-labels";

const HN_PROVIDER = "hn_hiring";

export function SignalsList({
  signals,
  companyNewsCollected,
}: {
  signals: CompanySignal[];
  /** Whether the company's own news pages were read on this run. */
  companyNewsCollected: boolean;
}) {
  return (
    <div>
      <Eyebrow as="h3">Company news and signals</Eyebrow>
      {signals.length === 0 ? (
        <EmptyState className="mt-2">
          {companyNewsCollected
            ? "Nothing dated was found on the company's own pages or in Hacker News hiring posts."
            : "No Hacker News hiring post was found for this company."}
        </EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {signals.map((signal, index) => (
            <li key={`${signal.url}-${index}`} className="py-3 first:pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{humanize(signal.signal_type)}</Badge>
                {signal.provider === HN_PROVIDER ? <Badge tone="teal">Hacker News</Badge> : null}
                {signal.date ? (
                  <span className="utility-label text-ink-faint">{signalDate(signal)}</span>
                ) : null}
                {signal.is_current === false ? (
                  <span className="utility-label text-ink-faint">not current</span>
                ) : null}
              </div>
              <ExternalLink href={signal.url} className="mt-1.5 block text-sm font-sans-semibold">
                {signal.title}
              </ExternalLink>
              {signal.provider === HN_PROVIDER ? (
                <p className="mt-1 text-xs text-ink-muted">
                  Posted on Hacker News by someone at the company; not verified.
                </p>
              ) : null}
              {signal.excerpt && signal.excerpt !== signal.title ? (
                <blockquote className="mt-1.5 border-l-2 border-signal-amber/40 pl-3 text-sm leading-relaxed text-ink-muted">
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

function signalDate(signal: CompanySignal): string {
  const date = signal.date ?? "";
  const shown = signal.date_precision === "month" ? formatMonth(date) : date;
  return signal.date_kind === "event" ? shown : `published ${shown}`;
}
