import type { Profile, ProfileUpsert } from "@/lib/api-client/client";

export type { Profile, ProfileUpsert };

/** PUT /profile replaces the whole row, so a partial edit has to send back
 * the fields it isn't changing. */
export function toUpsert(profile: Profile, changes: Partial<ProfileUpsert>): ProfileUpsert {
  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
    portfolio_url: profile.portfolio_url,
    x_url: profile.x_url,
    // Read back flat and sent back flat. Leaving these out would blank the
    // stored resume parse, since the fields are columns and JSON the server
    // rewrites wholesale, not a patch.
    summary: profile.summary,
    skills: profile.skills,
    work_history: profile.work_history,
    education: profile.education,
    projects: profile.projects,
    certificates: profile.certificates,
    languages: profile.languages,
    work_preference: profile.work_preference,
    regions: profile.regions ?? [],
    target_roles: profile.target_roles,
    ...changes,
  };
}

/** Resume parsing is wired up; the career-arc document is not yet. Files are
 * parsed in process and discarded either way, so there is never a document to
 * show here, only whether a parse exists. */
export const CAREER_ARC_PARSING_UNAVAILABLE =
  "Career arc parsing isn't wired up yet. You can finish without one and add it later.";
