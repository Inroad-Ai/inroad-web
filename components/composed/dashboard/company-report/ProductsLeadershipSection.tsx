import type { CompanyDetail, ResearchCoverage } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { safeHref } from "@/lib/safe-href";

const LINK = "break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4";

function Missing({ coverage, fallback }: { coverage?: ResearchCoverage; fallback: string }) {
  // The coverage reason says what research did, never that none exist.
  return <EmptyState className="mt-2">{coverage?.reason ?? fallback}</EmptyState>;
}

function Source({ url, excerpt }: { url: string | null; excerpt: string | null }) {
  if (!url) return null;
  return (
    <blockquote className="mt-1 border-l-2 border-line pl-3 text-sm text-text-secondary">
      {excerpt ? <>&ldquo;{excerpt}&rdquo; </> : null}
      <a
        href={safeHref(url) ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK}
      >
        {url}
      </a>
    </blockquote>
  );
}

/** Products and leaders from the company's own pages (sourcing backend). */
export function ProductsLeadershipSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research?.research_backend !== "sourcing") return null;
  const products = research.products ?? [];
  const leaders = research.leadership ?? [];
  const coverage = research.coverage ?? {};

  return (
    <Section title="Products and leadership">
      <p className="utility-label font-sans-semibold text-text-secondary">Products and services</p>
      {products.length === 0 ? (
        <Missing coverage={coverage.products} fallback="No product was named on the pages read." />
      ) : (
        <ul className="mt-2 space-y-4">
          {products.map((product, index) => (
            <li key={`${product.name}-${index}`}>
              <p className="text-sm text-ink">
                {product.name}
                {product.description ? (
                  <span className="text-text-secondary">: {product.description}</span>
                ) : null}
              </p>
              <Source url={product.source_url} excerpt={product.excerpt} />
            </li>
          ))}
        </ul>
      )}

      <p className="utility-label mt-6 font-sans-semibold text-text-secondary">Leadership</p>
      {leaders.length === 0 ? (
        <Missing coverage={coverage.leadership} fallback="No leader was named on the pages read." />
      ) : (
        <ul className="mt-2 space-y-4">
          {leaders.map((leader, index) => (
            <li key={`${leader.name}-${index}`}>
              <p className="text-sm text-ink">
                {leader.name}
                {leader.title ? (
                  <span className="text-text-secondary">, {leader.title}</span>
                ) : null}
              </p>
              <Source url={leader.source_url} excerpt={leader.excerpt} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
