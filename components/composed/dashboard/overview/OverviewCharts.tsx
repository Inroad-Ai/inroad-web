"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/ui/ChartCard";
import { PipelineBar } from "@/components/ui/PipelineBar";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/components/ui/StatusBadge";
import { CHART_COLORS, CHART_MARGIN, CHART_TICK, CHART_TOOLTIP } from "@/lib/chart-theme";
import { activeCompanyCount } from "@/lib/pipeline-metrics";
import type { OverviewStats } from "@/lib/types";

function weekLabel(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: { label: string; count: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-ink">
        <thead>
          <tr>
            <th scope="col" className="border-b border-line py-2">
              {columns[0]}
            </th>
            <th scope="col" className="border-b border-line py-2 text-right">
              {columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="border-b border-line py-2 font-normal">
                {row.label}
              </th>
              <td className="border-b border-line py-2 text-right">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OverviewCharts({ stats }: { stats: OverviewStats }) {
  const activity = stats.companies_by_week.map((item) => ({
    label: weekLabel(item.week_start),
    count: item.count,
  }));
  const added = activity.reduce((total, row) => total + row.count, 0);
  const hasTrend = activity.filter((row) => row.count > 0).length > 1;
  const active = activeCompanyCount(stats);
  const funnel = PIPELINE_STAGES.filter((stage) => stage !== "rejected").map((stage) => ({
    stage,
    label: STAGE_LABEL[stage],
    count: stats.by_stage[stage] ?? 0,
  }));
  const maxFunnel = Math.max(...funnel.map((row) => row.count));
  const response = [
    { name: "Responded or interviewing", value: stats.replied_companies, color: CHART_COLORS.teal },
    {
      name: "Other contacted companies",
      value: Math.max(0, stats.contacted_companies - stats.replied_companies),
      color: CHART_COLORS.muted,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          eyebrow="Research activity"
          title="Companies added"
          description="Weekly additions to your search."
          aside={`${added} added`}
          table={<ChartTable columns={["Week", "Companies added"]} rows={activity} />}
        >
          <div
            className="h-chart-sm"
            role="img"
            aria-label={`${added} companies added over the displayed weeks.`}
          >
            {hasTrend ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={CHART_MARGIN}>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.line} />
                  <XAxis
                    dataKey="label"
                    tick={CHART_TICK}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={CHART_TICK}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Companies added"
                    stroke={CHART_COLORS.teal}
                    fill={CHART_COLORS.teal}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-center text-sm text-text-secondary">
                Not enough activity to show a trend yet.
              </p>
            )}
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="Outreach health"
          title="Response rate"
          description="Share of contacted companies currently in Responded or Interviewing."
          table={
            <ChartTable
              columns={["Status", "Companies"]}
              rows={response.map((row) => ({ label: row.name, count: row.value }))}
            />
          }
        >
          {stats.contacted_companies ? (
            <div
              className="relative h-chart-sm"
              role="img"
              aria-label={`Response rate is ${stats.response_rate_percent} percent: ${stats.replied_companies} of ${stats.contacted_companies} contacted companies are responded or interviewing.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                  <Pie
                    data={response}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="82%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {response.map((row) => (
                      <Cell key={row.name} fill={row.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold text-ink">
                {stats.response_rate_percent}%
              </div>
            </div>
          ) : (
            <p className="flex h-chart-sm items-center justify-center text-center text-sm text-text-secondary">
              No outreach yet. Your response rate appears after a company is contacted.
            </p>
          )}
        </ChartCard>
      </div>

      <ChartCard
        eyebrow="Current position"
        title="Pipeline funnel"
        description="Open a stage to see the companies behind the number. Rejected companies are excluded."
        aside={`${active} active`}
        table={<ChartTable columns={["Stage", "Companies"]} rows={funnel} />}
      >
        <div role="list" aria-label="Pipeline stages" className="space-y-2">
          {funnel.map((row) => (
            <div role="listitem" key={row.stage}>
              <PipelineBar
                stage={row.stage}
                label={row.label}
                count={row.count}
                max={maxFunnel}
                href={`/companies/pipeline?stage=${row.stage}`}
              />
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
