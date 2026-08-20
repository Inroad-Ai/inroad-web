/**
 * Mirrors app/schemas/ in the backend, field for field. Pydantic
 * `Optional[X] = None` maps to `X | null`, never `X?`: the backend always
 * serialises the key, so a missing one is a bug.
 */

import type { PipelineStage } from "@/components/ui/StatusBadge";

export interface HomepageResult {
  url: string;
  final_url: string;
  status_code: number;
  title: string | null;
  description: string | null;
  headings: string[];
  word_count: number;
  /** Capped excerpt, synthesis input only - not rendered anywhere. */
  body_text: string | null;
  linkedin_url: string | null;
  /** apple-touch-icon / favicon / og:image, in that preference order. */
  logo_url: string | null;
  /** Best-effort brand fingerprints (script src, meta generator). Synthesis
   * input, not a real dependency scan. */
  detected_technologies: string[];
}

export interface NewsItem {
  title: string;
  link: string | null;
  source: string | null;
  published: string | null;
}

export interface NewsResult {
  query: string;
  count: number;
  items: NewsItem[];
}

export interface HiringResult {
  is_hiring: boolean;
  /** null means "could not count", not 0 ("counted, none open"). */
  open_roles: number | null;
  /** "greenhouse" | "lever" | "ashby" | "careers-page" */
  source: string | null;
  careers_url: string | null;
  sample_roles: string[];
  /** Platforms beyond `source` that also confirmed hiring: "indeed" |
   * "linkedin-jobs". Presence signal only, no role titles. */
  additional_sources: string[];
}

export interface LinkedInCompanyResult {
  url: string;
  raw_text: string;
}

/** LLM-synthesized narrative fields. Every field is a normal, expected null
 * when there wasn't enough scraped content to say something. */
export interface CompanyProfile {
  what_it_does: string | null;
  problem_solved: string | null;
  introduction: string | null;
  tech_stack: string[];
  company_size: string | null;
  funding: string | null;
  biggest_challenge: string | null;
  /** The outreach hook: why this company is worth contacting right now. */
  why_reach_out_now: string | null;
}

export interface CompanyDossier {
  domain: string;
  homepage: HomepageResult | null;
  news: NewsResult | null;
  hiring: HiringResult | null;
  linkedin: LinkedInCompanyResult | null;
  profile: CompanyProfile | null;
  /** Source name -> reason. Only contains entries for sources that failed. */
  errors: Record<string, string>;
  partial: boolean;
  from_cache: boolean;
  elapsed_ms: number;
}

/** The three mechanical sources, in the order the landing page's sample
 * dossier shows them. Not used by the real Research page anymore - that
 * page now shows a run list, not per-source cards - but the marketing
 * mockup (Hero, SampleDossier) still renders this layout. */
export const SOURCE_KEYS = ["homepage", "news", "hiring"] as const;
export type SourceKey = (typeof SOURCE_KEYS)[number];

/** A saved company row. CompanyDossier above is a live, not necessarily saved, result. */
export interface Company {
  id: string;
  domain: string;
  homepage_url: string | null;
  homepage_title: string | null;
  homepage_description: string | null;
  logo_url: string | null;
  is_hiring: boolean | null;
  /** null means "could not determine", not 0. Never coerce. */
  open_roles: number | null;
  hiring_source: string | null;
  careers_url: string | null;
  sample_roles: string[];
  profile: CompanyProfile | null;
  stage: PipelineStage;
  contacted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** One research_runs row without its raw_response, for the profile history list. */
export interface ResearchRunSummary {
  id: string;
  created_at: string;
  partial: boolean;
  from_cache: boolean;
  elapsed_ms: number;
}

/** GET /api/companies/{id}. The saved row plus its research trail. */
export interface CompanyDetail extends Company {
  /** The raw_response of the newest run, or null if the company has none. */
  latest_research: CompanyDossier | null;
  research_run_count: number;
  /** Newest first, capped by the backend, so this can be shorter than the count. */
  recent_research_runs: ResearchRunSummary[];
}

export const COMPANY_SORTS = [
  "updated_desc",
  "updated_asc",
  "created_desc",
  "created_asc",
  "domain_asc",
  "domain_desc",
] as const;
export type CompanySort = (typeof COMPANY_SORTS)[number];

export interface CompanyListResponse {
  items: Company[];
  page: number;
  page_size: number;
  total: number;
}

/** One row on the shared Job Board (GET /api/jobs) - pooled across every
 * user's research, not scoped to the caller. */
export interface Job {
  id: string;
  title: string;
  company_name: string;
  domain: string;
  url: string | null;
  source: string | null;
  discovered_at: string;
}

export interface JobListResponse {
  items: Job[];
  page: number;
  page_size: number;
  total: number;
}

/** One point on the Overview "companies added over time" chart. */
export interface WeeklyCompanyCount {
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

/**
 * What a single source card is doing right now. These are internal state
 * names — none of them appear on screen as written.
 */
export type CardState = "idle" | "pending" | "done" | "failed";
