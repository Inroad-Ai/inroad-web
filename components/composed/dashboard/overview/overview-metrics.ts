import { PIPELINE_STAGES, STAGE_LABEL, type PipelineStage } from "@/components/ui/StatusBadge";
import type { OverviewStats } from "@/lib/types";

export type FunnelStage = Exclude<PipelineStage, "rejected">;

export interface WeeklyPoint {
  label: string;
  companies: number;
}

export interface FunnelRow {
  stage: FunnelStage;
  label: string;
  count: number;
}

export interface OverviewMetrics {
  researched: number;
  active: number;
  progressed: number;
  /** Companies that have been reached out to, whatever happened next. */
  outreachBase: number;
  responseRate: number;
  outreachDelta: number;
  researchedShare: number;
  weekly: WeeklyPoint[];
  added: number;
  hasActivityTrend: boolean;
  funnel: FunnelRow[];
}

function weekLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function percent(part: number, whole: number): number {
  return whole ? Math.round((part / whole) * 100) : 0;
}

export function deriveOverviewMetrics(stats: OverviewStats): OverviewMetrics {
  const count = (stage: PipelineStage) => stats.by_stage[stage] ?? 0;
  const researched = count("researched");
  const active = count("contacted") + count("responded") + count("interviewing");
  const progressed = count("responded") + count("interviewing") + count("closed");
  const outreachBase = active + count("closed") + count("rejected");
  const weekly = stats.companies_by_week.map((item) => ({
    label: weekLabel(item.week_start),
    companies: item.count,
  }));

  return {
    researched,
    active,
    progressed,
    outreachBase,
    responseRate: percent(progressed, outreachBase),
    outreachDelta: stats.contacted_within_window - stats.contacted_within_prior_window,
    researchedShare: percent(researched, stats.total_companies),
    weekly,
    added: weekly.reduce((total, item) => total + item.companies, 0),
    hasActivityTrend: weekly.filter((item) => item.companies > 0).length > 1,
    funnel: PIPELINE_STAGES.filter((stage): stage is FunnelStage => stage !== "rejected").map(
      (stage) => ({ stage, label: STAGE_LABEL[stage], count: count(stage) }),
    ),
  };
}
