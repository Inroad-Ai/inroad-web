import type { NewsResult } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";

export function NewsSummary({ news }: { news: NewsResult | null }) {
  return (
    <div>
      <p className="utility-label font-sans-semibold text-text-secondary">News</p>
      {news === null ? (
        <EmptyState className="mt-2">The news check did not answer on the last run.</EmptyState>
      ) : news.items.length === 0 ? (
        <EmptyState className="mt-2">Nothing published about this company recently.</EmptyState>
      ) : (
        <ul className="mt-2 space-y-4">
          {news.items.map((item, index) => (
            <li key={`${item.link ?? item.title}-${index}`}>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-snug text-ink underline decoration-line underline-offset-4 hover:decoration-signal-teal"
                >
                  {item.title}
                </a>
              ) : (
                <span className="text-sm leading-snug text-ink">{item.title}</span>
              )}
              {item.source || item.published ? (
                <span className="utility-label mt-1 block text-text-secondary/70">
                  {[item.source, item.published].filter(Boolean).join(" - ")}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
