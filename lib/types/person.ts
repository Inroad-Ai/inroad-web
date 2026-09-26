/**
 * Mirrors app/schemas/ in the backend, field for field. Pydantic
 * `Optional[X] = None` maps to `X | null`, never `X?`: the backend always
 * serialises the key, so a missing one is a bug.
 */

/** Mirrors the `people.stage` CHECK constraint; update both together. */
export const PERSON_STAGES = ["found", "contacted", "replied", "closed"] as const;

export type PersonStage = (typeof PERSON_STAGES)[number];

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
