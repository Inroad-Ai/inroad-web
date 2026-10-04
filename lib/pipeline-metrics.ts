import type { OverviewStats } from "@/lib/types";

export const ACTIVE_COMPANY_STAGES = ["contacted", "responded", "interviewing"] as const;

export function activeCompanyCount(stats: OverviewStats): number {
  return ACTIVE_COMPANY_STAGES.reduce((sum, stage) => sum + (stats.by_stage[stage] ?? 0), 0);
}
