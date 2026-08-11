import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/composed/onboarding/OnboardingFlow";
import { resolvePostAuthPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Reads the caller's Supabase session on mount - nothing here is static, and
// there's no reason to prerender a page whose whole job is a signed-in user's data.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  // Middleware already keeps signed-out users out. This check is for the
  // other case: a returning user who already has a profile shouldn't see
  // the typeform again.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const path = await resolvePostAuthPath(supabase, user.id);
    if (path === "/research") redirect("/research");
  }

  return <OnboardingFlow />;
}
