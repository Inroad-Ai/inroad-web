import type { CompanySignal } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";
import { humanize } from "./fact-labels";

export function SignalsList({ signals }: { signals: CompanySignal[] }) {
  return (
    <div>
      <Eyebrow as="h3">Company news and signals</Eyebrow>
      {signals.length === 0 ? (
        <EmptyState className="mt-2">
          Nothing dated was found on the company&apos;s own news, press or blog pages.
        </EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {signals.map((signal, index) => (
            <li key={`${signal.url}-${index}`} className="py-3 first:pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{humanize(signal.signal_type)}</Badge>
                {signal.date ? (
                  <span className="utility-label text-ink-faint">
                    {signal.date_kind === "event" ? "" : "published "}
                    {signal.date}
                  </span>
                ) : null}
              </div>
              <ExternalLink href={signal.url} className="mt-1.5 block text-sm font-sans-semibold">
                {signal.title}
              </ExternalLink>
              {signal.excerpt ? (
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
