"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_COLOR,
  CHART_TICK,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "./chart-theme";

export interface RankedRow {
  key: string;
  label: string;
  value: number;
  /** Defaults to teal; a second colour must come with a legend. */
  color?: string;
}

const ROW_HEIGHT = 34;
const BAR_SIZE = 16;
const BAR_RADIUS: [number, number, number, number] = [0, 4, 4, 0];
const LABEL_WIDTH = 132;
// Room right of the longest bar for its value.
const MARGIN = { top: 0, right: 36, bottom: 0, left: 0 };

/** Horizontal bars on one baseline, in the order given: the form for
 * comparing parts (dataviz: ranked bars beat a pie or donut). Values are
 * printed at each bar's end, so colour never carries a number alone. */
export function RankedBars({
  rows,
  valueName,
  ariaLabel,
}: {
  rows: RankedRow[];
  valueName: string;
  ariaLabel: string;
}) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={rows.length * ROW_HEIGHT}>
        <BarChart data={rows} layout="vertical" margin={MARGIN}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={LABEL_WIDTH}
            tick={CHART_TICK}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={TOOLTIP_ITEM_STYLE}
            cursor={{ fill: CHART_COLOR.cursor }}
          />
          <Bar dataKey="value" name={valueName} barSize={BAR_SIZE} radius={BAR_RADIUS}>
            {rows.map((row) => (
              <Cell key={row.key} fill={row.color ?? CHART_COLOR.teal} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              fill={CHART_COLOR.value}
              fontSize={CHART_TICK.fontSize}
              fontFamily={CHART_TICK.fontFamily}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
