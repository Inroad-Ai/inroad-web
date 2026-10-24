"use client";

import type { Dispatch, SetStateAction } from "react";

import { parseResume } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { toFormFields } from "@/lib/resume";

import { applyResumeFields, type FormState, type ResumeState } from "./onboarding-form";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function validateResumeFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const acceptedExtension = extension === "pdf" || extension === "doc" || extension === "docx";
  if (!ACCEPTED_RESUME_TYPES.has(file.type) && !acceptedExtension) {
    return "File must be PDF or DOCX.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "File is larger than 10MB.";
  }
  return null;
}

/** Validates, uploads and parses a resume, then folds what it found into the form. */
export function useResumeUpload(
  setForm: Dispatch<SetStateAction<FormState>>,
  setResume: Dispatch<SetStateAction<ResumeState>>,
) {
  return async function selectResume(file: File) {
    const base = { fileName: file.name, fileSize: file.size };
    const validationError = validateResumeFile(file);
    if (validationError) {
      setResume({ ...base, state: "error", error: validationError });
      return;
    }

    setResume({ ...base, state: "uploading", error: null });

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setResume({
          ...base,
          state: "error",
          error: "Your session expired. Sign in again to read your resume.",
        });
        return;
      }

      const fields = toFormFields(await parseResume(file, token));
      setForm((prev) => applyResumeFields(prev, fields));
      setResume({ ...base, state: "done", error: null });
    } catch (error) {
      setResume({
        ...base,
        state: "error",
        error: error instanceof Error ? error.message : "Upload failed. Try again.",
      });
    }
  };
}
