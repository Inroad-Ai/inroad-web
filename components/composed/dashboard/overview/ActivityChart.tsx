"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/Badge";

import { DashboardPanel } from "../DashboardPanel";
import { ChartEmpty } from "./ChartEmpty";
import {
  CHART_COLOR,
  CHART_TICK,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "./chart-theme";
import type { WeeklyPoint } from "./overview-metrics";

const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];
const BAR_GAP = "28%";
const Y_AXIS_WIDTH = 28;
// Headroom above the tallest bar for its value label.
const CHART_MARGIN = { top: 20, right: 4, left: 0, bottom: 0 };

/** Companies added per week; the current week is lit amber. */
export function ActivityChart({
  weekly,
  added,
  hasTrend,
}: {
  weekly: WeeklyPoint[];
  added: number;
  hasTrend: boolean;
}) {
  const lastIndex = weekly.length - 1;

  return (
    <DashboardPanel
      eyebrow="Weekly trend"
      title="Research activity"
      description="Companies added to your search, week by week."
      meta={<Badge>{added} added</Badge>}
    >
      <div
        className="h-chart"
        role="img"
        aria-label={`${added} companies added over the displayed weeks.`}
      >
        {hasTrend ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} barCategoryGap={BAR_GAP} margin={CHART_MARGIN}>
              <CartesianGrid vertical={false} stroke={CHART_COLOR.grid} />
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
                width={Y_AXIS_WIDTH}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{ fill: CHART_COLOR.cursor }}
              />
              <Bar dataKey="companies" name="Companies added" radius={BAR_RADIUS}>
                {weekly.map((point, index) => (
                  <Cell
                    key={point.label}
                    fill={index === lastIndex ? CHART_COLOR.amber : CHART_COLOR.bar}
                  />
                ))}
                <LabelList
                  dataKey="companies"
                  position="top"
                  fill={CHART_COLOR.value}
                  fontSize={CHART_TICK.fontSize}
                  fontFamily={CHART_TICK.fontFamily}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmpty message="Not enough weeks of activity yet to plot a trend." />
        )}
      </div>
    </DashboardPanel>
  );
}
