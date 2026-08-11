/**
 * Mirrors app/models/dossier.py in the backend, field for field.
 *
 * Pydantic `Optional[X] = None` becomes `X | null` here rather than `X?`,
 * because the backend always serialises the key — it is present and null, not
 * absent. Keeping that distinction means a missing key is a bug, not a shrug.
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
  /** null means "could not count", which is not the same as 0 ("counted, none open"). */
  open_roles: number | null;
  /** "greenhouse" | "lever" | "careers-page" */
  source: string | null;
  careers_url: string | null;
  sample_roles: string[];
}

export interface CompanyDossier {
  domain: string;
  homepage: HomepageResult | null;
  news: NewsResult | null;
  hiring: HiringResult | null;
  /** Source name -> reason. Only contains entries for sources that failed. */
  errors: Record<string, string>;
  partial: boolean;
  from_cache: boolean;
  elapsed_ms: number;
}

/** The three sources, in the order they are shown everywhere in the UI. */
export const SOURCE_KEYS = ["homepage", "news", "hiring"] as const;
export type SourceKey = (typeof SOURCE_KEYS)[number];

/**
 * Mirrors app/schemas/company.py in the backend. A saved company row, as
 * returned by GET /api/companies - not to be confused with CompanyDossier
 * above, which is a live research result that hasn't necessarily been saved.
 */
export interface Company {
  id: string;
  domain: string;
  homepage_url: string | null;
  homepage_title: string | null;
  homepage_description: string | null;
  is_hiring: boolean | null;
  /** null means "could not determine", which is not the same as 0 ("counted, none open"). Never coerce. */
  open_roles: number | null;
  hiring_source: string | null;
  careers_url: string | null;
  sample_roles: string[];
  stage: PipelineStage;
  contacted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

/**
 * What a single source card is doing right now. These are internal state
 * names — none of them appear on screen as written.
 */
export type CardState = "idle" | "pending" | "done" | "failed";
