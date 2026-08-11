"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { TagInput } from "@/components/ui/TagInput";
import {
  WORK_PREFERENCE_OPTIONS,
  uploadOnboardingFile,
  type UploadState,
  type WorkPreferenceOption,
} from "@/lib/onboarding";
import {
  fetchProfile,
  fileNameFromPath,
  getSignedFileUrl,
  updateProfile,
  type ProfileRow,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/browser";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
}

function toFormState(profile: ProfileRow): FormState {
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
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const [resumePath, setResumePath] = useState<string | null>(null);
  const [careerArcPath, setCareerArcPath] = useState<string | null>(null);
  const [resumeUploadState, setResumeUploadState] = useState<UploadState>("idle");
  const [careerArcUploadState, setCareerArcUploadState] = useState<UploadState>("idle");
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [careerArcUploadProgress, setCareerArcUploadProgress] = useState(0);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [careerArcError, setCareerArcError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      setUserId(user.id);

      try {
        const profile = await fetchProfile(supabase, user.id);
        if (cancelled) return;
        if (profile) {
          setForm(toFormState(profile));
          setResumePath(profile.resume_storage_path);
          setCareerArcPath(profile.career_arc_storage_path);
          setResumeUploadState(profile.resume_storage_path ? "done" : "idle");
          setCareerArcUploadState(profile.career_arc_storage_path ? "done" : "idle");
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!userId || !form) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      await updateProfile(supabase, userId, {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        work_preference: form.workPreference,
        target_roles: form.targetRoles,
      });
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileReplace(
    bucket: "resumes" | "career-arc-documents",
    field: "resume" | "careerArc",
    file: File,
  ) {
    if (!userId) return;
    const setState = field === "resume" ? setResumeUploadState : setCareerArcUploadState;
    const setProgress = field === "resume" ? setResumeUploadProgress : setCareerArcUploadProgress;
    const setError = field === "resume" ? setResumeError : setCareerArcError;
    const setPath = field === "resume" ? setResumePath : setCareerArcPath;

    setState("uploading");
    setProgress(0);
    setError(null);

    try {
      const path = await uploadOnboardingFile({
        supabase,
        bucket,
        userId,
        file,
        onProgress: setProgress,
      });
      await updateProfile(
        supabase,
        userId,
        field === "resume" ? { resume_storage_path: path } : { career_arc_storage_path: path },
      );
      setPath(path);
      setState("done");
    } catch (error) {
      setState("error");
      setError(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function handleView(bucket: "resumes" | "career-arc-documents", path: string) {
    try {
      const url = await getSignedFileUrl(supabase, bucket, path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // Nothing to show beyond the failed click - the file itself is untouched.
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

  const resumeFileName = fileNameFromPath(resumePath);
  const careerArcFileName = fileNameFromPath(careerArcPath);

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
        <FileField
          label="Resume"
          fileName={resumeFileName}
          state={resumeUploadState}
          progress={resumeUploadProgress}
          errorMessage={resumeError}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onView={resumePath ? () => handleView("resumes", resumePath) : undefined}
          onSelect={(file) => handleFileReplace("resumes", "resume", file)}
        />

        <FileField
          label="Career arc document"
          fileName={careerArcFileName}
          state={careerArcUploadState}
          progress={careerArcUploadProgress}
          errorMessage={careerArcError}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onView={careerArcPath ? () => handleView("career-arc-documents", careerArcPath) : undefined}
          onSelect={(file) => handleFileReplace("career-arc-documents", "careerArc", file)}
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

function FileField({
  label,
  fileName,
  state,
  progress,
  errorMessage,
  accept,
  onView,
  onSelect,
}: {
  label: string;
  fileName: string | null;
  state: UploadState;
  progress: number;
  errorMessage: string | null;
  accept: string;
  onView?: () => void;
  onSelect: (file: File) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="utility-label text-text-secondary">{label}</span>
        {onView ? (
          <button
            type="button"
            onClick={onView}
            className="utility-label text-signal-teal hover:text-signal-teal-hover"
          >
            View
          </button>
        ) : null}
      </div>
      <div className="mt-2">
        <FileUpload
          accept={accept}
          fileName={fileName}
          state={state}
          progress={progress}
          errorMessage={errorMessage}
          onSelect={onSelect}
          // The "Replace" label already opens the file picker natively (it's
          // htmlFor the hidden input); this only needs to exist so the
          // control renders, current file stays shown until a new one lands.
          onRemove={() => undefined}
        />
      </div>
    </div>
  );
}
