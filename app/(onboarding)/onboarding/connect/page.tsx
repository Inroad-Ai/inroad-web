import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ConnectFlow } from "@/components/composed/onboarding/ConnectFlow";
import { fetchProfile, type Profile } from "@/lib/api-client/client";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-native/constants";

export const dynamic = "force-dynamic";

// Its own route, not a step inside /onboarding: Gmail and Apollo connect by
// OAuth redirect and land back here, and /onboarding sends anyone with a
// profile to /overview.
export default async function OnboardingConnectPage() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  let profile: Profile | null = null;
  let hasNoProfile = false;
  if (accessToken) {
    try {
      profile = await fetchProfile(accessToken);
      hasNoProfile = profile === null;
    } catch {
      // Fall through with no role or city; the steps don't need them.
    }
  }

  // Outside the try: redirect() signals by throwing.
  if (hasNoProfile) redirect("/onboarding");

  return (
    <ConnectFlow
      role={profile?.target_roles[0] ?? ""}
      city={profile?.location?.split(",")[0]?.trim() ?? ""}
    />
  );
}
