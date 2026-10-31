import type { CompanyDetail } from "@/lib/types";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { EvidenceQuote } from "./EvidenceQuote";

interface Entry {
  key: string;
  name: string;
  detail: string | null;
  separator: string;
  sourceUrl: string | null;
  excerpt: string | null;
}

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="mt-2 divide-y divide-line">
      {entries.map((entry) => (
        <li key={entry.key} className="flex flex-col gap-2 py-3 first:pt-1">
          <p className="text-sm text-ink">
            <span className="font-sans-semibold">{entry.name}</span>
            {entry.detail ? (
              <span className="text-ink-muted">
                {entry.separator}
                {entry.detail}
              </span>
            ) : null}
          </p>
          {entry.sourceUrl ? <EvidenceQuote url={entry.sourceUrl} excerpt={entry.excerpt} /> : null}
        </li>
      ))}
    </ul>
  );
}

/** Products and leaders from the company's own pages (sourcing backend). */
export function ProductsLeadershipSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research?.research_backend !== "sourcing") return null;
  const products = research.products ?? [];
  const leaders = research.leadership ?? [];
  if (products.length === 0 && leaders.length === 0) return null;

  return (
    <DashboardPanel title="Products and leadership">
      {products.length > 0 ? (
        <>
          <Eyebrow as="h3">Products and services</Eyebrow>
          <EntryList
            entries={products.map((product, index) => ({
              key: `${product.name}-${index}`,
              name: product.name,
              detail: product.description,
              separator: ": ",
              sourceUrl: product.source_url,
              excerpt: product.excerpt,
            }))}
          />
        </>
      ) : null}

      {leaders.length > 0 ? (
        <>
          <Eyebrow as="h3" className={products.length > 0 ? "mt-8" : undefined}>
            Leadership
          </Eyebrow>
          <EntryList
            entries={leaders.map((leader, index) => ({
              key: `${leader.name}-${index}`,
              name: leader.name,
              detail: leader.title,
              separator: ", ",
              sourceUrl: leader.source_url,
              excerpt: leader.excerpt,
            }))}
          />
        </>
      ) : null}
    </DashboardPanel>
  );
}
