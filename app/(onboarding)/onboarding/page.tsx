import { OnboardingFlow } from "@/components/composed/onboarding/OnboardingFlow";

// Reads the caller's Supabase session on mount - nothing here is static, and
// there's no reason to prerender a page whose whole job is a signed-in user's data.
export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
