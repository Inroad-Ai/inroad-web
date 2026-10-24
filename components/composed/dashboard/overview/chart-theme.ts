import type { CSSProperties } from "react";

/** Recharts takes colours as strings, so these point at the tokens rather
 * than copying values: both themes follow automatically. */
export const CHART_COLOR = {
  amber: "rgb(var(--color-signal-amber))",
  teal: "rgb(var(--color-signal-teal))",
  bar: "rgb(var(--color-ink) / 0.14)",
  track: "rgb(var(--color-ink) / 0.1)",
  grid: "rgb(var(--color-line))",
  cursor: "rgb(var(--color-ink) / 0.05)",
  text: "rgb(var(--color-ink-muted))",
  value: "rgb(var(--color-ink))",
} as const;

export const CHART_TICK = {
  fill: CHART_COLOR.text,
  fontSize: "var(--text-2xs-size)",
  fontFamily: "var(--font-mono)",
} as const;

export const TOOLTIP_STYLE: CSSProperties = {
  background: "rgb(var(--color-surface))",
  border: "none",
  borderRadius: "var(--radius-nest)",
  boxShadow: "var(--shadow-pop)",
  fontSize: "var(--text-xs-size)",
  fontFamily: "var(--font-body)",
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: CHART_COLOR.text,
  fontFamily: "var(--font-mono)",
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = { color: CHART_COLOR.value };
