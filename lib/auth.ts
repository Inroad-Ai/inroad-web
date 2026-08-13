import { fetchProfile } from "@/lib/api-client/client";

/** Where to land someone who just signed in. A missing profile is what
 * "hasn't onboarded" means, so the profile fetch is the check. */
export async function resolvePostAuthPath(
  accessToken: string,
): Promise<"/onboarding" | "/overview"> {
  const profile = await fetchProfile(accessToken);
  return profile ? "/overview" : "/onboarding";
}
