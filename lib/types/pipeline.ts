/** Mirrors app/schemas/pipeline.py. */

import type { components } from "@/lib/api-client/schema";
import type { PipelineStage } from "@/lib/types/company";

type OutreachDraftOut = components["schemas"]["OutreachDraftOut"];

export const PIPELINE_RUN_STATUSES = ["pending", "running", "completed", "failed"] as const;
export type PipelineRunStatus = (typeof PIPELINE_RUN_STATUSES)[number];

export interface PipelineRunOut {
  id: string;
  status: PipelineRunStatus;
  /** A message written for the user, and a code to branch on. */
  error: string | null;
  error_code: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

/** GET /api/companies/match/{run_id}. Empty matched_company_ids until
 * status is "completed" - and it can stay empty on a completed run that
 * matched nothing, which is a valid outcome, not a failure. */
export interface MatchRunResult extends PipelineRunOut {
  matched_company_ids: string[];
}

/** GET /api/people/{person_id}/outreach/runs/{run_id}. Empty drafts until
 * status is "completed"; a completed run carries both channel rows at the
 * sequence position it drafted. */
export interface OutreachDraftRunResult extends PipelineRunOut {
  sequence_index: number;
  drafts: OutreachDraftOut[];
}

/** One point on the Overview "companies added over time" chart. */
interface WeeklyCompanyCount {
  week_start: string;
  count: number;
}

/** Mirrors app/schemas/company.py OverviewStats, from GET /api/companies/overview. */
export interface OverviewStats {
  total_companies: number;
  by_stage: Record<PipelineStage, number>;
  contacted_window_days: number;
  contacted_within_window: number;
  contacted_within_prior_window: number;
  companies_by_week: WeeklyCompanyCount[];
}
