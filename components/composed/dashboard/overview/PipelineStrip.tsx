import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/Icons";
import { Card } from "@/components/ui/Card";

import type { FunnelRow } from "./overview-metrics";

/** Where every saved company stands, in one line. */
export function PipelineStrip({ funnel }: { funnel: FunnelRow[] }) {
  return (
    <Card as="section" aria-label="Pipeline" padding="sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {funnel.map((row, index) => (
          <li key={row.stage} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="text-ink-faint">
                <ArrowRightIcon />
              </span>
            ) : null}
            <Link
              href="/companies/pipeline"
              className="flex items-baseline gap-2 rounded-nest px-3 py-1.5 transition-colors duration-fast hover:bg-ink/5"
            >
              <span className="font-display text-xl font-sans-semibold tabular-nums text-ink">
                {row.count}
              </span>
              <span className="text-sm text-ink-muted">{row.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}
