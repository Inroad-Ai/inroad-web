"use client";

import { useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DocumentSearchIcon, UploadIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { StatusDot } from "@/components/ui/StatusDot";
import { parseResume } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
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
      const token = await requireAccessToken();
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
    <Card variant="nested" padding="none" className="overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_RESUME_FILES}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void selectResume(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-nest bg-signal-amber-subtle text-signal-amber">
          <DocumentSearchIcon />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-sans-semibold text-ink">
              {fileName ?? (hasResume ? "Imported resume data" : "Your resume")}
            </p>
            <Badge tone={available ? "success" : "neutral"} dot={available}>
              {status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {state === "uploading"
              ? "Reading and extracting your latest resume"
              : available
                ? `${roleCount} roles and ${skillCount} skills are available for matching`
                : "Upload a PDF or DOCX, up to 10MB, to populate your profile"}
          </p>
          {state === "uploading" ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-ink-muted" role="status">
              <StatusDot state="pending" />
              Parsing resume
            </p>
          ) : null}
          {state === "done" ? (
            <p className="mt-2 text-xs text-success">
              Review the imported details, then save your profile.
            </p>
          ) : null}
          {error ? (
            <Notice size="xs" className="mt-2">
              {error}
            </Notice>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
          <Button
            type="button"
            size="sm"
            variant="quiet"
            icon={<UploadIcon />}
            disabled={state === "uploading"}
            onClick={() => inputRef.current?.click()}
          >
            {available ? "Replace resume" : "Upload resume"}
          </Button>
          {available && !confirmingDelete ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={state === "uploading"}
              onClick={() => setConfirmingDelete(true)}
              className="text-error hover:text-error"
            >
              Delete resume
            </Button>
          ) : null}
        </div>
      </div>
      {confirmingDelete ? (
        <div
          role="alertdialog"
          aria-label="Delete resume"
          className="flex flex-col gap-3 border-t border-line bg-error-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-ink-muted">
            This clears imported profile data after you save your profile.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="quiet"
              onClick={deleteResume}
              className="text-error"
            >
              Confirm delete
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
