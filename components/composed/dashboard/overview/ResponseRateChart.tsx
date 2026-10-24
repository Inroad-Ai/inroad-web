"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { CHART_COLOR, TOOLTIP_ITEM_STYLE, TOOLTIP_STYLE } from "./chart-theme";

const INNER_RADIUS = "74%";
const OUTER_RADIUS = "92%";
const SLICE_GAP_DEGREES = 3;

export function ResponseRateChart({
  responseRate,
  progressed,
  outreachBase,
}: {
  responseRate: number;
  progressed: number;
  outreachBase: number;
}) {
  const hasOutreach = outreachBase > 0;
  const slices = hasOutreach
    ? [
        { name: "Moved forward", value: progressed, color: CHART_COLOR.teal },
        {
          name: "Awaiting reply",
          value: Math.max(0, outreachBase - progressed),
          color: CHART_COLOR.track,
        },
      ]
    : [{ name: "No outreach yet", value: 1, color: CHART_COLOR.track }];

  return (
    <DashboardPanel
      eyebrow="Outreach health"
      title="Response rate"
      description={
        hasOutreach
          ? "Reached-out companies that moved past first contact."
          : "Start outreach to see how replies are going."
      }
    >
      <div
        className="relative h-chart"
        role="img"
        aria-label={`Response rate is ${responseRate} percent.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius={INNER_RADIUS}
              outerRadius={OUTER_RADIUS}
              paddingAngle={hasOutreach ? SLICE_GAP_DEGREES : 0}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-sans-semibold leading-display tracking-display text-ink tabular-nums">
            {hasOutreach ? `${responseRate}%` : "-"}
          </span>
          <Eyebrow as="span" className="mt-2">
            Response rate
          </Eyebrow>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-signal-teal" />
          Moved forward
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-ink/10" />
          Awaiting reply
        </span>
      </div>
    </DashboardPanel>
  );
}
