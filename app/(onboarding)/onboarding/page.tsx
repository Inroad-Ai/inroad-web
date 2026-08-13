import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/composed/onboarding/OnboardingFlow";
import { fetchProfile } from "@/lib/api-client/client";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-native/constants";

// Nothing here is static: the whole page is one signed-in user's data.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  // Middleware already keeps signed-out users out. This is the other case: a
  // returning user with a profile shouldn't see the typeform again. A failed
  // call falls through to the flow, since showing onboarding twice is
  // recoverable and bouncing someone who hasn't done it is not.
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  let hasProfile = false;
  if (accessToken) {
    try {
      hasProfile = (await fetchProfile(accessToken)) !== null;
    } catch {
      // Fall through to the flow.
    }
  }

  // Outside the try: redirect() signals by throwing, so calling it inside
  // would hit the catch above and render the flow anyway.
  if (hasProfile) redirect("/overview");

  return <OnboardingFlow />;
}
