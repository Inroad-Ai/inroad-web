import type { CompanyBrief } from "@/lib/company-brief";
import { formatMonth } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

export function NewsSection({ brief }: { brief: CompanyBrief }) {
  if (brief.news.length === 0) return null;

  return (
    <DashboardPanel title="Recent news">
      <ol className="flex flex-col gap-4 border-l border-line pl-5">
        {brief.news.map((item) => (
          <li key={item.url} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{item.kind}</Badge>
              {item.date ? (
                <span className="utility-label text-ink-faint">{formatMonth(item.date)}</span>
              ) : null}
            </div>
            <ExternalLink href={item.url} className="text-sm font-sans-semibold">
              {item.title}
            </ExternalLink>
          </li>
        ))}
      </ol>
    </DashboardPanel>
  );
}
