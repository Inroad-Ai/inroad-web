/**
 * Mirrors app/schemas/ in the backend, field for field. Pydantic
 * `Optional[X] = None` maps to `X | null`, never `X?`: the backend always
 * serialises the key, so a missing one is a bug.
 */

import type { PipelineStage } from "@/components/ui/StatusBadge";
import type { PersonStage } from "@/components/ui/PersonStageBadge";

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
  /** The company's own careers page, kept even when an ATS board is the
   * winning source. Unlike `careers_url`, which may be an ATS board root,
   * this is a page on the company's own domain that answered a request. */
  company_careers_url: string | null;
  sample_roles: string[];
  /** Platforms beyond `source` that also confirmed hiring: "indeed" |
   * "linkedin-jobs". Presence signal only, no role titles. */
  additional_sources: string[];
  /** "<title>: <excerpt>" for sampled postings that published a body.
   * Synthesis input for tech_stack, not rendered anywhere. */
  sample_role_descriptions: string[];
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

/** Mirrors the `people.role_category` CHECK constraint; update both together. */
export const PERSON_ROLES = [
  "founder",
  "co_founder",
  "executive",
  "hr",
  "recruiter",
  "employee",
] as const;
export type PersonRole = (typeof PERSON_ROLES)[number];

export const PERSON_ROLE_LABEL: Record<PersonRole, string> = {
  founder: "Founder",
  co_founder: "Co-Founder",
  executive: "Executive",
  hr: "HR",
  recruiter: "Recruiter",
  employee: "Employee",
};

/** Mirrors app/schemas/dossier.py Person - one research run's raw find, no
 * id and no pipeline stage. See `Person` below for the persisted row. */
export interface DossierPerson {
  name: string;
  role_category: PersonRole;
  title: string | null;
  linkedin_url: string | null;
  email: string | null;
  /** "team-page" | "linkedin-search" */
  source: string;
}

export interface PeopleResult {
  people: DossierPerson[];
}

export interface CompanyDossier {
  domain: string;
  homepage: HomepageResult | null;
  news: NewsResult | null;
  hiring: HiringResult | null;
  linkedin: LinkedInCompanyResult | null;
  people: PeopleResult | null;
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

/** Mirrors app/schemas/people.py PersonOut - a person's row as it persists
 * across research runs, with its own pipeline stage. See `DossierPerson`
 * above for one run's raw, unpersisted find. */
export interface Person {
  id: string;
  company_id: string;
  name: string;
  role_category: PersonRole;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  source: string | null;
  stage: PersonStage;
  contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

/** GET /api/people - one row per person, across every company, for the
 * contacts board's columns. */
export interface PersonListItem extends Person {
  company_domain: string;
}

export interface PersonListResponse {
  items: PersonListItem[];
  page: number;
  page_size: number;
  total: number;
}

/** GET /api/people/{id} - a person's own row plus enough about their
 * company to show context and link back to it. */
export interface PersonDetail extends Person {
  company_domain: string;
  company_homepage_title: string | null;
}

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
  /** The company's own careers page, kept even when an ATS board is the
   * winning source. Unlike `careers_url`, which may be an ATS board root,
   * this is a page on the company's own domain that answered a request. */
  company_careers_url: string | null;
  sample_roles: string[];
  profile: CompanyProfile | null;
  primary_contact_id: string | null;
  /** Set only when this company came from a Job Run match, not manual
   * domain research - null on everything researched by URL. */
  matched_role_title: string | null;
  matched_role_url: string | null;
  matched_posted_text: string | null;
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
  people: Person[];
  primary_contact: Person | null;
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

/** Mirrors app/schemas/pipeline.py. */
export const PIPELINE_RUN_STATUSES = ["pending", "running", "completed", "failed"] as const;
export type PipelineRunStatus = (typeof PIPELINE_RUN_STATUSES)[number];

export interface PipelineRunOut {
  id: string;
  status: PipelineRunStatus;
  error: string | null;
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

/** Onboarding fields the summary screen can badge as "from your resume" vs
 * "you typed this" - only the fields that show up as their own editable row
 * there, not summary/skills/workHistory/education/projects. Internal state
 * only, mirrors nothing on the backend. */
export type FieldSourceKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "location"
  | "linkedinUrl"
  | "githubUrl"
  | "portfolioUrl";

export type FieldSource = "resume" | "manual";

export type FieldSourceMap = Partial<Record<FieldSourceKey, FieldSource>>;
