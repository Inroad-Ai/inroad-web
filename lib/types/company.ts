/**
 * Mirrors app/schemas/ in the backend, field for field. Pydantic
 * `Optional[X] = None` maps to `X | null`, never `X?`: the backend always
 * serialises the key, so a missing one is a bug.
 */

import type { DossierPerson, Person } from "@/lib/types/person";

/** Mirrors the `companies.stage` CHECK constraint; update both together. */
export const PIPELINE_STAGES = [
  "researched",
  "contacted",
  "responded",
  "interviewing",
  "closed",
  "rejected",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

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

/** One open role with its own application link, when the source has one. */
export interface RolePosting {
  title: string;
  url: string | null;
  external_id: string | null;
  location: string | null;
  remote: boolean | null;
  department: string | null;
  employment_type: string | null;
  posted_at: string | null;
  /** "verified" | "board" | "fallback" | "unverified" */
  apply_url_state: string;
  /** Sourcing boards only: "listed_in_latest_complete_scan" |
   * "listed_in_latest_scan" | "not_seen_in_latest_scan". */
  availability?: string | null;
}

interface HiringResult {
  /** null: unknown (a careers page, but nothing said whether roles are open). */
  is_hiring: boolean | null;
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
  /** Same roles as sample_roles with their links; on the sourcing backend
   * also roles missing from the board's latest scan (not in sample_roles). */
  role_postings?: RolePosting[];
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

export interface PeopleResult {
  people: DossierPerson[];
}

/** A verbatim excerpt of a fetched page that supports a fact. */
export interface SourcedEvidence {
  source_url: string;
  excerpt: string;
}

export interface SourcedFact {
  fact_type: string;
  /** Usually { text }, a product is { name, description, ... }. */
  value: Record<string, unknown>;
  provider: string;
  model: string;
  evidence: SourcedEvidence[];
}

/** A dated event from the company's own news, press or blog pages. */
export interface CompanySignal {
  signal_type: string;
  title: string;
  description: string | null;
  url: string;
  publisher_host: string | null;
  date: string | null;
  /** "event" when the page dates the event itself, else "published". */
  date_kind: string | null;
  claim_source: string | null;
  excerpt: string | null;
}

/** A person as listed on the company's own site, and where. */
export interface SourcedPerson {
  name: string;
  title: string | null;
  kind: string | null;
  page_url: string | null;
  excerpt: string | null;
}

export interface SourceDocumentRef {
  url: string;
  page_type: string;
  title: string | null;
  /** "crawler" or "olostep"; absent on older dossiers. */
  acquired_via?: string;
}

export interface SourcedProduct {
  name: string;
  description: string | null;
  category: string | null;
  url: string | null;
  source_url: string | null;
  excerpt: string | null;
}

/** A leader named on the company's own site. Public role data only. */
export interface SourcedLeader {
  name: string;
  title: string | null;
  source_url: string | null;
  excerpt: string | null;
}

export type CoverageStatus =
  "not_researched" | "not_found" | "found_verified" | "found_uncertain" | "collection_failed";

/** What research did for one category - never a claim about the company. */
export interface ResearchCoverage {
  status: CoverageStatus;
  reason: string;
  items: number;
  fresh_until: string | null;
}

export interface ProviderUsage {
  provider: string;
  operation: string;
  requests: number;
  retries: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cache_hits: number | null;
}

export interface CompanyDossier {
  domain: string;
  /** Absent on dossiers saved before the sourcing backend existed. */
  research_backend?: "legacy" | "sourcing";
  sourcing_run_id?: string | null;
  facts?: SourcedFact[];
  sources?: SourceDocumentRef[];
  signals?: CompanySignal[];
  sourced_people?: SourcedPerson[];
  /** Wall time of each sourcing stage, milliseconds. */
  stage_ms?: Record<string, number>;
  /** Sourcing backend only; absent on older dossiers. */
  products?: SourcedProduct[];
  leadership?: SourcedLeader[];
  coverage?: Record<string, ResearchCoverage>;
  researched_at?: string | null;
  research_reused?: boolean;
  provider_usage?: ProviderUsage[];
  partial_failures?: string[];
  homepage: HomepageResult | null;
  news: NewsResult | null;
  hiring: HiringResult | null;
  linkedin: LinkedInCompanyResult | null;
  people: PeopleResult | null;
  profile: CompanyProfile | null;
  /** Source name -> reason. Only contains entries for sources that failed. */
  errors: Record<string, string>;
  /** Source name -> reason, for data this research did not gather or found no
   * statement of: unknown, not a failure. Absent on older dossiers. */
  not_collected?: Record<string, string>;
  partial: boolean;
  from_cache: boolean;
  elapsed_ms: number;
}

/** The three mechanical sources, in the order the landing page's sample
 * dossier shows them. Not used by the real Research page anymore - that
 * page now shows a run list, not per-source cards - but the marketing
 * mockup (Hero, SampleDossier) still renders this layout. */
const SOURCE_KEYS = ["homepage", "news", "hiring"] as const;
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
