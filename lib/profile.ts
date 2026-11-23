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

/** Regions the API accepts in `excluded_places`, besides country codes. */
export const EXCLUDED_REGION_OPTIONS: { value: string; label: string }[] = [
  { value: "europe", label: "Europe" },
  { value: "middle_east", label: "Middle East" },
  { value: "africa", label: "Africa" },
  { value: "asia_pacific", label: "Asia Pacific" },
  { value: "latin_america", label: "Latin America" },
  { value: "north_america", label: "North America" },
];
