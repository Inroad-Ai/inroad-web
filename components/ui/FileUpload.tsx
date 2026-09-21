"use client";

import { useEffect, useId, useRef, useState } from "react";

import { AlertCircleIcon, CheckCircleIcon, UploadIcon } from "@/components/ui/Icons";
import type { UploadState } from "@/lib/onboarding";

// The parse is one round trip with no field-level signal to report, so this
// cycles honest phrases about what's happening rather than faking a
// per-field checklist the backend can't actually back up. Covers the wire
// upload too - for a resume-sized file that leg is sub-second, not worth its
// own fake percentage.
const PARSE_PHASES = ["Uploading…", "Reading your resume…", "Extracting your details…"];

function useRotatingPhase(active: boolean, phases: readonly string[], intervalMs = 1400) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setIndex((current) => Math.min(current + 1, phases.length - 1));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [active, phases.length, intervalMs]);

  return phases[index];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileUploadProps {
  accept: string;
  fileName: string | null;
  fileSize?: number | null;
  state: UploadState;
  errorMessage?: string | null;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  onRetry?: () => void;
  autoFocus?: boolean;
}

export function FileUpload({
  accept,
  fileName,
  fileSize,
  state,
  errorMessage,
  onSelect,
  onRemove,
  onRetry,
  autoFocus,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const isBusy = state === "uploading";
  const rotatingPhase = useRotatingPhase(isBusy, PARSE_PHASES);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onSelect(file);
  }

  if (state === "idle") {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your resume"
        autoFocus={autoFocus}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex min-h-[240px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed p-8 text-center transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-signal-teal focus-visible:outline-offset-2 ${
          dragActive
            ? "border-signal-teal bg-signal-teal-subtle"
            : "border-line hover:border-signal-teal/60"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSelect(file);
            event.target.value = "";
          }}
        />
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-secondary">
          <UploadIcon />
        </span>
        <p className="text-sm text-text-primary">
          Drag your resume here or{" "}
          <span className="font-medium text-signal-teal">browse files</span>
        </p>
        <p className="text-xs text-text-secondary">PDF or DOCX · up to 10MB</p>
      </div>
    );
  }

  return (
    <div
      className={`animate-fade-up w-full rounded-xl border p-5 transition-colors duration-200 ${
        state === "done"
          ? "border-success/30 bg-success-subtle"
          : state === "error"
            ? "border-error/30 bg-error-subtle"
            : "border-line bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {state === "done" ? (
            <span className="mt-0.5 shrink-0 text-success">
              <CheckCircleIcon />
            </span>
          ) : state === "error" ? (
            <span className="mt-0.5 shrink-0 text-error">
              <AlertCircleIcon />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm text-text-primary">{fileName}</p>
            {fileSize && state !== "error" ? (
              <p className="text-xs text-text-secondary">{formatFileSize(fileSize)}</p>
            ) : null}
            {isBusy ? (
              <p className="mt-1.5 text-xs font-medium text-signal-teal">{rotatingPhase}</p>
            ) : null}
            {state === "done" ? <p className="mt-1 text-xs text-success">Uploaded</p> : null}
            {state === "error" && errorMessage ? (
              <p className="mt-1 text-xs text-error">{errorMessage}</p>
            ) : null}
          </div>
        </div>

        {state === "done" && onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="utility-label shrink-0 text-text-secondary hover:text-signal-teal"
          >
            Replace
          </button>
        ) : null}
        {state === "error" && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="utility-label shrink-0 text-error hover:text-error/80"
          >
            Retry
          </button>
        ) : null}
      </div>

      {isBusy ? (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line">
          <div className="animate-indeterminate h-full w-1/3 rounded-full bg-signal-teal" />
        </div>
      ) : null}
    </div>
  );
}
