import type { FormState, ResumeState } from "./onboarding-form";

// Scoped per user, not global, so a shared machine can't resume one
// account's half-finished onboarding into a different account's session.
const DRAFT_KEY_PREFIX = "inroad-onboarding-draft:";

export interface OnboardingDraft {
  form: FormState;
  stepIndex: number;
  resume: ResumeState;
}

export function loadDraft(userId: string): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY_PREFIX + userId);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : null;
  } catch {
    // Corrupted or inaccessible storage just means starting fresh.
    return null;
  }
}

export function saveDraft(userId: string, draft: OnboardingDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY_PREFIX + userId, JSON.stringify(draft));
  } catch {
    // Full or blocked storage (private browsing): best effort only.
  }
}

export function clearDraft(userId: string): void {
  try {
    localStorage.removeItem(DRAFT_KEY_PREFIX + userId);
  } catch {
    // Same as above.
  }
}
