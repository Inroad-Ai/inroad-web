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
    work_preference: profile.work_preference,
    target_roles: profile.target_roles,
    ...changes,
  };
}

/** Resume and career-arc files are parsed in process and discarded, never
 * stored, so there is nothing to upload or download yet. The parsing flow
 * that replaces this is its own phase; see project-overview.md. */
export const FILE_PARSING_UNAVAILABLE =
  "Resume and career-arc parsing isn't wired up yet. You can finish without one and add it later.";
