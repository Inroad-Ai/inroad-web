"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { saveProfile } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

import { ContactDetailsScreen } from "./ContactDetailsScreen";
import { EmailScreen } from "./EmailScreen";
import { LinksScreen } from "./LinksScreen";
import { NameScreen } from "./NameScreen";
import { clearDraft } from "./onboarding-draft";
import { INITIAL_RESUME, toProfileUpsert, withManualSource } from "./onboarding-form";
import {
  PHASES,
  STEP_IDS,
  STEP_PHASE_INDEX,
  TOTAL_STEPS,
  phaseFill,
  showsProfileCard,
  type StepId,
} from "./onboarding-steps";
import { ProfileSoFar } from "./ProfileSoFar";
import { ScreenShell } from "./ScreenShell";
import { SummaryScreen } from "./SummaryScreen";
import { TargetRoleScreen } from "./TargetRoleScreen";
import { UploadScreen } from "./UploadScreen";
import { useOnboardingDraft } from "./useOnboardingDraft";
import { DOCUMENT_ACCEPT, useResumeUpload } from "./useResumeUpload";
import { WelcomeScreen } from "./WelcomeScreen";
import { WorkPreferenceScreen } from "./WorkPreferenceScreen";

export function OnboardingFlow() {
  const { stepIndex, setStepIndex, form, setForm, resume, setResume, userId, hydrated } =
    useOnboardingDraft();
  const selectResume = useResumeUpload(setForm, setResume);
  const router = useRouter();

  const [direction, setDirection] = useState(1);
  // True while the current screen was reached via "Edit" on the summary:
  // Continue and Back both return straight to the summary in that case.
  const [editingFromSummary, setEditingFromSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = STEP_IDS[stepIndex];

  function goTo(id: StepId, towards: number) {
    setDirection(towards);
    setStepIndex(STEP_IDS.indexOf(id));
  }

  function editFromSummary(id: StepId) {
    setEditingFromSummary(true);
    goTo(id, -1);
  }

  function next() {
    if (editingFromSummary) {
      setEditingFromSummary(false);
      goTo("summary", 1);
      return;
    }
    setDirection(1);
    setStepIndex((index) => Math.min(index + 1, STEP_IDS.length - 1));
  }

  function back() {
    if (editingFromSummary) {
      setEditingFromSummary(false);
      goTo("summary", 1);
      return;
    }
    setDirection(-1);
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSubmitError("Your session expired. Sign in again to finish setup.");
        return;
      }

      await saveProfile(toProfileUpsert(form), token);
      if (userId) clearDraft(userId);
      router.push("/onboarding/connect");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong saving your profile.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const onBack = stepIndex > 0 ? back : undefined;

  return (
    <ScreenShell
      stepKey={hydrated ? step : "loading"}
      direction={direction}
      step={stepIndex + 1}
      total={TOTAL_STEPS}
      phases={PHASES}
      fills={phaseFill(stepIndex)}
      currentPhaseIndex={STEP_PHASE_INDEX[step]}
      aside={
        hydrated && showsProfileCard(step) ? <ProfileSoFar form={form} resume={resume} /> : null
      }
    >
      {!hydrated ? (
        // A saved draft only arrives after fetchMe and loadDraft resolve;
        // rendering the real step before then risks it landing on top of
        // something the user just typed.
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <>
          {step === "welcome" ? <WelcomeScreen phases={PHASES} onStart={next} /> : null}

          {step === "resume" ? (
            <UploadScreen
              heading="Start with your resume"
              helperText="PDF or DOCX. We read it, fill in what we can, and never keep the file."
              accept={DOCUMENT_ACCEPT}
              optional={false}
              fileName={resume.fileName}
              fileSize={resume.fileSize}
              state={resume.state}
              errorMessage={resume.error}
              onSelect={selectResume}
              onRemove={() => setResume(INITIAL_RESUME)}
              onRetry={() => setResume(INITIAL_RESUME)}
              onNext={next}
              onBack={onBack}
              // Only offered once a parse has actually failed: the point is not
              // being stuck on this step, not skipping it outright.
              onSkip={resume.state === "error" ? next : undefined}
              autoFocus
            />
          ) : null}

          {step === "name" ? (
            <NameScreen
              firstName={form.firstName}
              lastName={form.lastName}
              onChange={(firstName, lastName) =>
                setForm((prev) => ({
                  ...prev,
                  firstName,
                  lastName,
                  fieldSource: withManualSource(prev, { firstName, lastName }),
                }))
              }
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "email" ? (
            <EmailScreen
              email={form.email}
              prefilled={form.emailPrefilled}
              onChange={(email) =>
                setForm((prev) => ({
                  ...prev,
                  email,
                  emailPrefilled: false,
                  fieldSource: withManualSource(prev, { email }),
                }))
              }
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "contact" ? (
            <ContactDetailsScreen
              phone={form.phone}
              location={form.location}
              onChange={(phone, location) =>
                setForm((prev) => ({
                  ...prev,
                  phone,
                  location,
                  fieldSource: withManualSource(prev, { phone, location }),
                }))
              }
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "links" ? (
            <LinksScreen
              links={{
                linkedinUrl: form.linkedinUrl,
                githubUrl: form.githubUrl,
                portfolioUrl: form.portfolioUrl,
              }}
              onChange={(links) =>
                setForm((prev) => ({
                  ...prev,
                  ...links,
                  fieldSource: withManualSource(prev, links),
                }))
              }
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "workPreference" ? (
            <WorkPreferenceScreen
              selected={form.workPreference}
              onChange={(workPreference) => setForm((prev) => ({ ...prev, workPreference }))}
              regions={form.regions}
              onRegionsChange={(regions) => setForm((prev) => ({ ...prev, regions }))}
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "targetRole" ? (
            <TargetRoleScreen
              targetRoles={form.targetRoles}
              onChange={(targetRoles) => setForm((prev) => ({ ...prev, targetRoles }))}
              onNext={next}
              onBack={onBack}
            />
          ) : null}

          {step === "summary" ? (
            <SummaryScreen
              firstName={form.firstName}
              lastName={form.lastName}
              email={form.email}
              phone={form.phone}
              location={form.location}
              linkedinUrl={form.linkedinUrl}
              githubUrl={form.githubUrl}
              portfolioUrl={form.portfolioUrl}
              skills={form.skills}
              resumeFileName={resume.state === "done" ? resume.fileName : null}
              workPreference={form.workPreference}
              targetRoles={form.targetRoles}
              fieldSource={form.fieldSource}
              onEditName={() => editFromSummary("name")}
              onEditEmail={() => editFromSummary("email")}
              onEditPhone={() => editFromSummary("contact")}
              onEditLocation={() => editFromSummary("contact")}
              onEditLinks={() => editFromSummary("links")}
              onEditResume={() => editFromSummary("resume")}
              onEditWorkPreference={() => editFromSummary("workPreference")}
              onEditTargetRole={() => editFromSummary("targetRole")}
              onSubmit={handleSubmit}
              onBack={onBack}
              submitting={submitting}
              submitError={submitError}
            />
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}
