import type { CompanyBrief } from "@/lib/company-brief";
import { Card } from "@/components/ui/Card";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

export function ProductsSection({ brief }: { brief: CompanyBrief }) {
  if (brief.products.length === 0) return null;

  return (
    <DashboardPanel title="Products">
      <ul className="grid gap-3 sm:grid-cols-2">
        {brief.products.map((product) => (
          <Card as="li" key={product.name} variant="nested" padding="sm">
            <p className="text-sm font-sans-semibold text-ink">
              {product.url ? (
                <ExternalLink href={product.url}>{product.name}</ExternalLink>
              ) : (
                product.name
              )}
            </p>
            {product.description ? (
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{product.description}</p>
            ) : null}
          </Card>
        ))}
      </ul>
    </DashboardPanel>
  );
}
