import type { PipelineStage } from "@/lib/types";

export const CHART_COLORS = {
  teal: "rgb(var(--color-signal-teal))",
  amber: "rgb(var(--color-signal-amber))",
  success: "rgb(var(--color-success))",
  warning: "rgb(var(--color-warning))",
  rose: "rgb(var(--color-muted-rose))",
  muted: "rgb(var(--color-surface-raised))",
  line: "rgb(var(--color-line))",
  text: "rgb(var(--color-text-secondary))",
  surface: "rgb(var(--color-surface))",
} as const;

export const STAGE_CHART_COLORS: Record<PipelineStage, string> = {
  researched: CHART_COLORS.text,
  contacted: CHART_COLORS.teal,
  responded: CHART_COLORS.teal,
  interviewing: CHART_COLORS.success,
  closed: CHART_COLORS.warning,
  rejected: CHART_COLORS.rose,
};

export const CHART_TICK = {
  fill: CHART_COLORS.text,
  fontSize: "var(--text-xs-size)",
};

export const CHART_TOOLTIP = {
  background: CHART_COLORS.surface,
  border: `thin solid ${CHART_COLORS.line}`,
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--shadow-card)",
  fontSize: "var(--text-xs-size)",
};

export const CHART_MARGIN = { top: 0, right: 0, left: 0, bottom: 0 };
