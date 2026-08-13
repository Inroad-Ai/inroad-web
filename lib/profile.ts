/** Profile reads and writes go through the typed api-client. The file
 * helpers at the bottom are still Supabase Storage; buckets haven't
 * migrated yet. */

import type { SupabaseClient } from "@supabase/supabase-js";

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
    resume_storage_path: profile.resume_storage_path,
    career_arc_storage_path: profile.career_arc_storage_path,
    work_preference: profile.work_preference,
    target_roles: profile.target_roles,
    ...changes,
  };
}

/** Uploads went to Supabase Storage on a Supabase session, which native-auth
 * accounts don't have, so they fail for every account created since the
 * auth cutover. */
export const FILE_STORAGE_UNAVAILABLE =
  "File uploads are unavailable while storage is being migrated. You can finish without one and add it later.";

/** `{userId}/{timestamp}-{name}` -> `{name}`. */
export function fileNameFromPath(path: string | null): string | null {
  if (!path) return null;
  const segment = path.split("/").pop() ?? path;
  return segment.replace(/^\d+-/, "");
}

export async function getSignedFileUrl(
  supabase: SupabaseClient,
  bucket: "resumes" | "career-arc-documents",
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Could not create a download link.");
  return data.signedUrl;
}
