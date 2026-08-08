/**
 * Mirrors app/models/dossier.py in the backend, field for field.
 *
 * Pydantic `Optional[X] = None` becomes `X | null` here rather than `X?`,
 * because the backend always serialises the key — it is present and null, not
 * absent. Keeping that distinction means a missing key is a bug, not a shrug.
 */

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
 * What a single source card is doing right now. These are internal state
 * names — none of them appear on screen as written.
 */
export type CardState = "idle" | "pending" | "done" | "failed";
