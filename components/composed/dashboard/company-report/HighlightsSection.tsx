import type { CompanyBrief } from "@/lib/company-brief";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

/** What the company says about itself that the rest of the page does not. */
export function HighlightsSection({ brief }: { brief: CompanyBrief }) {
  if (brief.highlights.length === 0) return null;

  return (
    <DashboardPanel title="Worth knowing">
      <ul className="grid gap-3 md:grid-cols-2">
        {brief.highlights.map((entry) => (
          <Card as="li" key={entry.text} variant="nested" padding="sm" className="flex flex-col">
            <Eyebrow as="h3">{entry.label}</Eyebrow>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink">{entry.text}</p>
            {entry.sourceUrl ? (
              <ExternalLink href={entry.sourceUrl} className="mt-2 text-xs">
                Source
              </ExternalLink>
            ) : null}
          </Card>
        ))}
      </ul>
    </DashboardPanel>
  );
}
