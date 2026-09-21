"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { parseResume } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { UploadState } from "@/lib/onboarding";
import { toFormFields, type ParsedFields } from "@/lib/resume";

const ACCEPTED_RESUME_FILES =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function ResumeManager({
  hasResume,
  roleCount,
  skillCount,
  onParsed,
  onDeleted,
}: {
  hasResume: boolean;
  roleCount: number;
  skillCount: number;
  onParsed: (fields: ParsedFields) => void;
  onDeleted: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function selectResume(file: File) {
    setState("uploading");
    setFileName(file.name);
    setError(null);

    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
      const parsed = await parseResume(file, token);
      onParsed(toFormFields(parsed));
      setState("done");
    } catch (caught) {
      setState("error");
      setError(caught instanceof Error ? caught.message : "Could not parse this resume.");
    }
  }

  function deleteResume() {
    onDeleted();
    setFileName(null);
    setState("idle");
    setConfirmingDelete(false);
  }

  const available = hasResume || state === "done";
  const status = state === "done" ? "Ready to save" : hasResume ? "Imported" : "Not uploaded";

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-surface-raised">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_RESUME_FILES}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void selectResume(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-signal-teal/20 bg-signal-teal-subtle text-signal-teal">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-5 w-5 fill-none stroke-current"
            strokeWidth="1.5"
          >
            <path d="M5 2.75h6l4 4v10.5H5z" strokeLinejoin="round" />
            <path d="M11 2.75v4h4M7.5 11h5M7.5 14h3.5" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-text-primary">
              {fileName ?? (hasResume ? "Imported resume data" : "Your resume")}
            </p>
            <span
              className={`utility-label rounded-full px-2 py-1 ${
                available ? "bg-success-subtle text-success" : "bg-surface text-text-secondary"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {state === "uploading"
              ? "Reading and extracting your latest resume"
              : available
                ? `${roleCount} roles and ${skillCount} skills are available for matching`
                : "Upload a PDF or DOCX, up to 10MB, to populate your profile"}
          </p>
          {state === "uploading" ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
              <StatusDot state="pending" />
              Parsing resume
            </p>
          ) : null}
          {state === "done" ? (
            <p className="mt-2 text-xs text-success">
              Review the imported details, then save your profile.
            </p>
          ) : null}
          {error ? <p className="mt-2 text-xs text-error">{error}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
          <Button
            type="button"
            size="sm"
            variant="quiet"
            disabled={state === "uploading"}
            onClick={() => inputRef.current?.click()}
          >
            {available ? "Replace resume" : "Upload resume"}
          </Button>
          {available && !confirmingDelete ? (
            <button
              type="button"
              disabled={state === "uploading"}
              onClick={() => setConfirmingDelete(true)}
              className="utility-label px-2 py-2 text-error hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete resume
            </button>
          ) : null}
        </div>
      </div>
      {confirmingDelete ? (
        <div className="flex flex-col gap-3 border-t border-line bg-error-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-secondary">
            This clears imported profile data after you save your profile.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="utility-label text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={deleteResume}
              className="utility-label text-error hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
