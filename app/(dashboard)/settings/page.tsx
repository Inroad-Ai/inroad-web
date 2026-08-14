"use client";

import Link from "next/link";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Field } from "@/components/ui/Field";
import { useProfile } from "@/hooks/useProfile";
import { CAREER_ARC_PARSING_UNAVAILABLE } from "@/lib/profile";

/**
 * Account-level only. Everything about the person - name, contact, links,
 * skills, history, what they're looking for - lives on the Profile page and
 * is not duplicated here.
 */
export default function SettingsPage() {
  const { profile, loading, error } = useProfile();

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
      </div>
    </PageShell>
  );
}
