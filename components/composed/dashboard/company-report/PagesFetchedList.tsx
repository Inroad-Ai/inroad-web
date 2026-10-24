import type { SourceDocumentRef } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";

export function PagesFetchedList({ sources }: { sources: SourceDocumentRef[] }) {
  return (
    <div>
      <Eyebrow as="h3">Pages fetched</Eyebrow>
      {sources.length === 0 ? (
        <EmptyState className="mt-2">No pages came back with this run.</EmptyState>
      ) : (
        <ul className="mt-2 space-y-2">
          {sources.map((source) => (
            <li key={source.url} className="flex flex-wrap items-center gap-2 text-sm">
              <Badge tone="neutral">{source.page_type}</Badge>
              <ExternalLink href={source.url} className="min-w-0 break-all">
                {source.title ?? source.url}
              </ExternalLink>
              {source.acquired_via === "olostep" ? (
                <span className="text-xs text-ink-muted">via Olostep</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
