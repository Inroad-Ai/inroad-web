"use client";

import { useId } from "react";

import type { UploadState } from "@/lib/onboarding";

interface FileUploadProps {
  accept: string;
  fileName: string | null;
  state: UploadState;
  progress: number;
  errorMessage?: string | null;
  onSelect: (file: File) => void;
  onRemove?: () => void;
}

export function FileUpload({
  accept,
  fileName,
  state,
  progress,
  errorMessage,
  onSelect,
  onRemove,
}: FileUploadProps) {
  const inputId = useId();
  const showPicker = !fileName || state === "error";

  return (
    <div className="w-full rounded-md border border-line bg-surface p-5">
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          event.target.value = "";
        }}
      />

      {showPicker ? (
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center gap-2 py-8 text-center"
        >
          <span className="utility-label text-signal-teal">Choose a file</span>
          <span className="text-xs text-text-secondary">PDF or DOCX, up to 10MB</span>
        </label>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm text-text-primary">{fileName}</p>
            {state === "uploading" ? (
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-signal-teal transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null}
            {state === "done" ? (
              <p className="mt-1 text-xs text-success">Uploaded</p>
            ) : null}
          </div>
          {state === "done" && onRemove ? (
            <label
              htmlFor={inputId}
              onClick={onRemove}
              className="utility-label shrink-0 cursor-pointer text-text-secondary hover:text-signal-teal"
            >
              Replace
            </label>
          ) : null}
        </div>
      )}

      {state === "error" && errorMessage ? (
        <p className="mt-2 text-xs text-error">{errorMessage}</p>
      ) : null}
    </div>
  );
}
