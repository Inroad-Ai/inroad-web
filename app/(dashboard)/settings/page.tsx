"use client";

import Link from "next/link";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Field } from "@/components/ui/Field";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { useProfile } from "@/hooks/useProfile";
import { useSettings } from "@/hooks/useSettings";
import { CAREER_ARC_PARSING_UNAVAILABLE } from "@/lib/profile";
import type { FollowUpCadence } from "@/lib/api-client/client";

// Total messages per channel = 1 initial + the follow-ups. Mirrors
// FOLLOW_UP_COUNTS in app/schemas/settings.py.
const CADENCE_OPTIONS: { value: FollowUpCadence; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "3 follow-ups, 4 emails total" },
  { value: "standard", label: "Standard", description: "5 follow-ups, 6 emails total" },
  { value: "aggressive", label: "Aggressive", description: "6 follow-ups, 7 emails total" },
];

/**
 * Account-level only. Everything about the person - name, contact, links,
 * skills, history, what they're looking for - lives on the Profile page and
 * is not duplicated here.
 */
export default function SettingsPage() {
  const { profile, loading, error } = useProfile();
  const settings = useSettings();

  if (loading) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-text-secondary">Loading...</p>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-error">{error}</p>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-text-secondary">
          You haven&apos;t finished setup yet.{" "}
          <Link href="/onboarding" className="text-signal-teal underline underline-offset-4">
            Complete onboarding
          </Link>{" "}
          to see your account here.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Settings" description="Your account. Profile details live on Profile.">
      <div className="max-w-3xl">
        <section className="mt-6 space-y-4 rounded-sm border border-line bg-surface p-6">
          <Field
            label="Email"
            hint="Your sign-in address. Changing it needs re-verification, which isn't built yet."
          >
            <p className="w-full rounded-sm border border-line bg-surface-raised px-4 py-3.5 text-base text-text-secondary">
              {profile.email}
            </p>
          </Field>
        </section>

        <section className="mt-6 rounded-sm border border-line bg-surface p-6">
          {/* There is no file to show: what gets kept is the parsed result,
              not the document it came from. */}
          <Field label="Career arc document">
            <p className="w-full rounded-sm border border-line bg-surface p-5 text-sm text-text-secondary">
              {profile.career_arc_parsed_json ? "Parsed" : "Nothing parsed yet"}
              <span className="mt-1 block text-xs">{CAREER_ARC_PARSING_UNAVAILABLE}</span>
            </p>
          </Field>
        </section>

        <section className="mt-6 rounded-sm border border-line bg-surface p-6">
          <Field
            label="Follow-up cadence"
            hint="How many follow-ups get drafted after the initial outreach, for both email and LinkedIn. Each one is drafted on demand from its tab on a contact's page."
          >
            {settings.loading || !settings.settings ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {CADENCE_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.value}
                    selected={settings.settings?.follow_up_cadence === option.value}
                    onClick={() => settings.update(option.value)}
                  >
                    <span className="block">{option.label}</span>
                    <span className="mt-1 block text-xs text-text-secondary">
                      {option.description}
                    </span>
                  </SelectableCard>
                ))}
              </div>
            )}
            {settings.error ? (
              <p className="mt-2 text-xs text-error" role="alert">
                {settings.error}
              </p>
            ) : null}
          </Field>
        </section>
      </div>
    </PageShell>
  );
}
