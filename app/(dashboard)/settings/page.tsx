"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { TagInput } from "@/components/ui/TagInput";
import { fetchProfile, saveProfile } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";
import { FILE_PARSING_UNAVAILABLE, toUpsert, type Profile } from "@/lib/profile";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
}

function toFormState(profile: Profile): FormState {
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone,
    workPreference: profile.work_preference,
    targetRoles: profile.target_roles,
  };
}

export default function SettingsPage() {
  // The whole row, not just editable fields: PUT replaces the row, so a save
  // has to send the storage paths back untouched rather than blanking them.
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          if (!cancelled) setLoadError("Your session expired. Sign in again.");
          return;
        }

        const loaded = await fetchProfile(token);
        if (cancelled || !loaded) return;
        setProfile(loaded);
        setForm(toFormState(loaded));
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load your profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  function toggleWorkPreference(option: WorkPreferenceOption) {
    if (!form) return;
    const next = form.workPreference.includes(option)
      ? form.workPreference.filter((value) => value !== option)
      : [...form.workPreference, option];
    update("workPreference", next);
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
          email: form.email.trim(),
          phone: form.phone.trim(),
          work_preference: form.workPreference,
          target_roles: form.targetRoles,
        }),
        token,
      );
      setProfile(updated);
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-text-secondary">Loading your profile...</p>
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-error">{loadError}</p>
      </PageShell>
    );
  }

  if (!form) {
    return (
      <PageShell title="Settings">
        <p className="max-w-3xl text-sm text-text-secondary">
          You haven&apos;t finished setup yet.{" "}
          <Link href="/onboarding" className="text-signal-teal underline underline-offset-4">
            Complete onboarding
          </Link>{" "}
          to see your profile here.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Settings" description="Everything from onboarding, editable here.">
      <div className="max-w-3xl">
      <section className="mt-8 space-y-4 rounded-sm border border-line bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
          </Field>
          <Field label="Last name">
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
          </Field>
        </div>

        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>

        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>

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

        <div className="flex items-center gap-4 pt-2">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          {saved ? <span className="text-sm text-success">Saved</span> : null}
          {saveError ? <span className="text-sm text-error">{saveError}</span> : null}
        </div>
      </section>

      <section className="mt-6 space-y-6 rounded-sm border border-line bg-surface p-6">
        <FileField label="Resume" parsed={profile?.resume_parsed_json ?? null} />

        <FileField
          label="Career arc document"
          parsed={profile?.career_arc_parsed_json ?? null}
        />
      </section>
      </div>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="utility-label text-text-secondary">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** There is no file to show: what gets kept is the parsed result, not the
 * document it came from. */
function FileField({ label, parsed }: { label: string; parsed: unknown }) {
  return (
    <div>
      <span className="utility-label text-text-secondary">{label}</span>
      <p className="mt-2 w-full rounded-md border border-line bg-surface p-5 text-sm text-text-secondary">
        {parsed ? "Parsed" : "Nothing parsed yet"}
        <span className="mt-1 block text-xs">{FILE_PARSING_UNAVAILABLE}</span>
      </p>
    </div>
  );
}
