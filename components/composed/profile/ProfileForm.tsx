"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EducationEditor } from "@/components/composed/profile/EducationEditor";
import { WorkHistoryEditor } from "@/components/composed/profile/WorkHistoryEditor";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { TagInput } from "@/components/ui/TagInput";
import { useProfile } from "@/hooks/useProfile";
import {
  saveProfile,
  type EducationEntry,
  type Profile,
  type WorkHistoryEntry,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";
import { toUpsert } from "@/lib/profile";

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
}

function toFormState(profile: Profile): FormState {
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    location: profile.location ?? "",
    linkedinUrl: profile.linkedin_url ?? "",
    githubUrl: profile.github_url ?? "",
    portfolioUrl: profile.portfolio_url ?? "",
    // Optional in the generated type because the server defaults them, so
    // they are absent rather than empty on a profile with no parse.
    skills: profile.skills ?? [],
    workHistory: profile.work_history ?? [],
    education: profile.education ?? [],
    workPreference: profile.work_preference,
    targetRoles: profile.target_roles,
  };
}

/** Empty means "not set" on the way out. Sending "" would store a blank
 * string that reads as a real value everywhere downstream. */
function orNull(value: string): string | null {
  return value.trim() || null;
}

function withoutBlanks<T extends object>(entries: T[]): T[] {
  return entries.filter((entry) =>
    Object.values(entry).some((value) => typeof value === "string" && value.trim()),
  );
}

export function ProfileForm() {
  const { profile, setProfile, loading, error } = useProfile();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(toFormState(profile));
  }, [profile]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  function toggleWorkPreference(option: WorkPreferenceOption) {
    if (!form) return;
    update(
      "workPreference",
      form.workPreference.includes(option)
        ? form.workPreference.filter((value) => value !== option)
        : [...form.workPreference, option],
    );
  }

  async function handleSave() {
    if (!profile || !form) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSaveError("Your session expired. Sign in again.");
        return;
      }

      const updated = await saveProfile(
        toUpsert(profile, {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
          location: orNull(form.location),
          linkedin_url: orNull(form.linkedinUrl),
          github_url: orNull(form.githubUrl),
          portfolio_url: orNull(form.portfolioUrl),
          skills: form.skills,
          work_history: withoutBlanks(form.workHistory),
          education: withoutBlanks(form.education),
          work_preference: form.workPreference,
          target_roles: form.targetRoles,
        }),
        token,
      );
      setProfile(updated);
      setSaved(true);
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="max-w-3xl text-sm text-text-secondary">Loading your profile...</p>;
  }

  if (error) {
    return <p className="max-w-3xl text-sm text-error">{error}</p>;
  }

  if (!profile || !form) {
    return (
      <p className="max-w-3xl text-sm text-text-secondary">
        You haven&apos;t finished setup yet.{" "}
        <Link href="/onboarding" className="text-signal-teal underline underline-offset-4">
          Complete onboarding
        </Link>{" "}
        to see your profile here.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <Section title="You">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
          </Field>
          <Field label="Last name">
            <Input
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </Field>
        </div>

        <Field label="Email" hint="Your sign-in address. Changing it is an account change.">
          <p className="w-full rounded-sm border border-line bg-surface-raised px-4 py-3.5 text-base text-text-secondary">
            {profile.email}
          </p>
        </Field>

        <Field label="Phone">
          <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        </Field>

        <Field label="Location">
          <Input
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Berlin, Germany"
          />
        </Field>
      </Section>

      <Section title="Links">
        <Field label="LinkedIn">
          <Input
            type="url"
            value={form.linkedinUrl}
            onChange={(event) => update("linkedinUrl", event.target.value)}
            placeholder="https://linkedin.com/in/you"
          />
        </Field>
        <Field label="GitHub">
          <Input
            type="url"
            value={form.githubUrl}
            onChange={(event) => update("githubUrl", event.target.value)}
            placeholder="https://github.com/you"
          />
        </Field>
        <Field label="Portfolio or site">
          <Input
            type="url"
            value={form.portfolioUrl}
            onChange={(event) => update("portfolioUrl", event.target.value)}
            placeholder="https://yoursite.com"
          />
        </Field>
      </Section>

      <Section title="What you're looking for">
        <Field label="Target roles">
          <TagInput
            value={form.targetRoles}
            onChange={(targetRoles) => update("targetRoles", targetRoles)}
          />
        </Field>

        <div>
          <span className="utility-label text-text-secondary">Work preference</span>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {WORK_PREFERENCE_OPTIONS.map((option) => (
              <SelectableCard
                key={option.value}
                selected={form.workPreference.includes(option.value)}
                onClick={() => toggleWorkPreference(option.value)}
              >
                {option.label}
              </SelectableCard>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Skills">
        <Field label="Skills">
          <TagInput
            value={form.skills}
            onChange={(skills) => update("skills", skills)}
            placeholder="Python, PostgreSQL, ..."
          />
        </Field>
      </Section>

      <Section title="Work history">
        <WorkHistoryEditor
          entries={form.workHistory}
          onChange={(workHistory) => update("workHistory", workHistory)}
        />
      </Section>

      <Section title="Education">
        <EducationEditor
          entries={form.education}
          onChange={(education) => update("education", education)}
        />
      </Section>

      <div className="mt-8 flex items-center gap-4">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
        {saved ? <span className="text-sm text-success">Saved</span> : null}
        {saveError ? <span className="text-sm text-error">{saveError}</span> : null}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 space-y-4 rounded-sm border border-line bg-surface p-6">
      <h2 className="utility-label text-text-secondary">{title}</h2>
      {children}
    </section>
  );
}
