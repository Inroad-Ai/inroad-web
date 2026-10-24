import type { NewsResult } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";

export function NewsSummary({
  news,
  notCollected = false,
  firstPartyOnly = false,
}: {
  news: NewsResult | null;
  notCollected?: boolean;
  /** Only the company's own news, press and blog pages were read. */
  firstPartyOnly?: boolean;
}) {
  return (
    <div>
      <Eyebrow as="h3">News</Eyebrow>
      {news === null && notCollected ? (
        <EmptyState className="mt-2">News is not part of this research yet.</EmptyState>
      ) : news === null ? (
        <EmptyState className="mt-2">The news check did not answer on the last run.</EmptyState>
      ) : news.items.length === 0 ? (
        <EmptyState className="mt-2">
          {firstPartyOnly
            ? "Nothing dated was found on the company's own news, press or blog pages."
            : "Nothing published about this company recently."}
        </EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {news.items.map((item, index) => (
            <li key={`${item.link ?? item.title}-${index}`} className="py-3 first:pt-1">
              <ExternalLink href={item.link} className="text-sm font-sans-semibold leading-snug">
                {item.title}
              </ExternalLink>
              {item.source || item.published ? (
                <span className="utility-label mt-1.5 block text-ink-faint">
                  {[item.source, item.published].filter(Boolean).join(" · ")}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
