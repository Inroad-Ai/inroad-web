"use client";

import { useEffect, useMemo, useState } from "react";

import { saveProfile } from "@/lib/api-client/client";
import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";
import type { WorkPreferenceOption } from "@/lib/onboarding";
import type { ParsedFields } from "@/lib/resume";
import { useProfile } from "@/hooks/useProfile";
import {
  toFormState,
  toProfileUpsert,
  validateProfile,
  type FormState,
  type ValidatedField,
  type ValidationErrors,
} from "./profile-form-state";

export function useProfileForm() {
  const { profile, setProfile, loading, error } = useProfile();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (profile) setForm(toFormState(profile));
  }, [profile]);

  const isDirty = useMemo(
    () => (profile && form ? JSON.stringify(form) !== JSON.stringify(toFormState(profile)) : false),
    [profile, form],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next[key as ValidatedField];
      return next;
    });
    setSaveError(null);
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

  function applyParsedResume(fields: ParsedFields) {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            firstName: fields.firstName || previous.firstName,
            lastName: fields.lastName || previous.lastName,
            phone: fields.phone || previous.phone,
            location: fields.location || previous.location,
            linkedinUrl: fields.linkedinUrl || previous.linkedinUrl,
            githubUrl: fields.githubUrl || previous.githubUrl,
            portfolioUrl: fields.portfolioUrl || previous.portfolioUrl,
            summary: fields.summary || previous.summary,
            skills: fields.skills.length ? fields.skills : previous.skills,
            workHistory: fields.workHistory.length ? fields.workHistory : previous.workHistory,
            education: fields.education.length ? fields.education : previous.education,
            projects: fields.projects.length ? fields.projects : previous.projects,
            certificates: fields.certificates.length ? fields.certificates : previous.certificates,
            languages: fields.languages.length ? fields.languages : previous.languages,
          }
        : previous,
    );
    setSaved(false);
    setSaveError(null);
  }

  function applyDeletedResume() {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            summary: "",
            skills: [],
            workHistory: [],
            education: [],
            projects: [],
            certificates: [],
            languages: [],
          }
        : previous,
    );
    setSaved(false);
    setSaveError(null);
  }

  async function save() {
    if (!profile || !form) return;

    const errors = validateProfile(form);
    setValidationErrors(errors);
    if (Object.keys(errors).length) {
      setSaveError("Review the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSaveError(SESSION_EXPIRED);
        return;
      }

      const updated = await saveProfile(toProfileUpsert(profile, form), token);
      setForm(toFormState(updated));
      setProfile(updated);
      setSaved(true);
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  return {
    profile,
    form,
    loading,
    error,
    saving,
    saved,
    saveError,
    isDirty,
    validationErrors,
    update,
    toggleWorkPreference,
    applyParsedResume,
    applyDeletedResume,
    save,
  };
}

export type ProfileFormController = ReturnType<typeof useProfileForm>;
