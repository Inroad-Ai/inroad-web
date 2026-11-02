"use client";

import type { ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import type { OverviewInsights } from "@/lib/api-client/client";
import type { OverviewStats } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { CHART_COLOR } from "./chart-theme";
import type { OverviewMetrics } from "./overview-metrics";

/** The headline numbers, each with one line of what it means. */
export function StatTiles({
  stats,
  metrics,
  insights,
}: {
  stats: OverviewStats;
  metrics: OverviewMetrics;
  insights: OverviewInsights | null;
}) {
  const thisWeek = metrics.weekly.at(-1)?.companies ?? 0;
  const outreach = stats.contacted_within_window;
  const delta = outreach - stats.contacted_within_prior_window;

  return (
    <section
      aria-label="Your search in numbers"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <Tile
        label="Companies saved"
        value={stats.total_companies}
        detail={thisWeek ? `+${thisWeek} this week` : "None added this week"}
      >
        <Sparkline points={metrics.weekly.map((week) => week.companies)} />
      </Tile>
      <Tile
        label="Roles that fit you"
        value={insights?.fitting_roles ?? 0}
        detail={
          insights
            ? `At ${insights.companies_with_fit} of ${insights.companies_considered} companies`
            : "Across your companies"
        }
      />
      <Tile
        label={`Outreach, last ${stats.contacted_window_days} days`}
        value={outreach}
        detail={
          delta === 0
            ? "Same as the 30 days before"
            : `${delta > 0 ? "+" : ""}${delta} on the 30 days before`
        }
      />
      <Tile
        label="Response rate"
        value={metrics.outreachBase ? `${metrics.responseRate}%` : "–"}
        detail={
          metrics.outreachBase
            ? `${metrics.progressed} of ${metrics.outreachBase} replied`
            : "Shows after your first outreach"
        }
      >
        <ProgressBar value={metrics.responseRate / 100} tone="teal" />
      </Tile>
      <Tile
        label="Contacts ready"
        value={insights?.contacts_ready ?? 0}
        detail={
          insights
            ? `${insights.contacts_with_email} with an email address`
            : "People picked to write to"
        }
      />
    </section>
  );
}

function Tile({
  label,
  value,
  detail,
  children,
}: {
  label: string;
  value: number | string;
  detail: string;
  children?: ReactNode;
}) {
  return (
    <Card padding="sm" className="flex min-w-0 flex-col gap-2">
      <Eyebrow as="h2">{label}</Eyebrow>
      <p className="font-display text-3xl font-sans-semibold leading-display tracking-heading text-ink tabular-nums">
        {value}
      </p>
      <p className="text-xs text-ink-muted">{detail}</p>
      {children ? <div className="mt-auto pt-1">{children}</div> : null}
    </Card>
  );
}

/** Shape only: the tile's number and line say the values. */
function Sparkline({ points }: { points: number[] }) {
  if (points.filter((point) => point > 0).length < 2) return null;
  const data = points.map((value, index) => ({ index, value }));
  return (
    <div aria-hidden className="h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLOR.amber}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
