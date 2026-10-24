"use client";

import { useEffect, useState } from "react";

import { fetchMe } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

import { loadDraft, saveDraft } from "./onboarding-draft";
import { INITIAL_FORM, INITIAL_RESUME, type FormState, type ResumeState } from "./onboarding-form";

/** The flow's form, step and resume state, restored from the signed-in
 * user's saved draft on mount and autosaved on every change after that. */
export function useOnboardingDraft() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [resume, setResume] = useState<ResumeState>(INITIAL_RESUME);
  const [userId, setUserId] = useState<string | null>(null);
  // Guards the save effect from firing before the restore attempt finishes,
  // or the empty initial state would write over a real draft on mount.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => (token ? fetchMe(token) : null))
      .then((user) => {
        if (cancelled || !user) return;
        setUserId(user.id);

        const draft = loadDraft(user.id);
        if (draft) {
          setForm(draft.form);
          setStepIndex(draft.stepIndex);
          // An interrupted upload has no file left to resume, only a spinner
          // with nothing behind it: only "done" or "error" come back.
          setResume(
            draft.resume.state === "done" || draft.resume.state === "error"
              ? draft.resume
              : INITIAL_RESUME,
          );
          return;
        }

        setForm((prev) =>
          prev.email ? prev : { ...prev, email: user.email, emailPrefilled: true },
        );
      })
      .catch(() => {
        // No prefill, no draft; the flow still works from scratch.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !userId) return;
    saveDraft(userId, { form, stepIndex, resume });
  }, [hydrated, userId, form, stepIndex, resume]);

  return { stepIndex, setStepIndex, form, setForm, resume, setResume, userId, hydrated };
}
