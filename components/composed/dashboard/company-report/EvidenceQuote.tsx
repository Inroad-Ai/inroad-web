import { ExternalLinkIcon } from "@/components/ui/Icons";

import { ExternalLink } from "./ExternalLink";

function withoutProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/** A verbatim excerpt and the page it came from. */
export function EvidenceQuote({ url, excerpt }: { url: string; excerpt: string | null }) {
  return (
    <figure className="border-l-2 border-signal-amber/40 pl-3">
      {excerpt ? (
        <blockquote className="text-sm leading-relaxed text-ink-muted">
          &ldquo;{excerpt}&rdquo;
        </blockquote>
      ) : null}
      <figcaption className={excerpt ? "mt-1.5" : ""}>
        <ExternalLink
          href={url}
          className="inline-flex items-start gap-1.5 break-all text-xs font-sans-semibold no-underline"
        >
          <ExternalLinkIcon />
          {withoutProtocol(url)}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}
