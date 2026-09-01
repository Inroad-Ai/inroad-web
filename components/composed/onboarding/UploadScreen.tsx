import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import type { UploadState } from "@/lib/onboarding";

/** The file-upload step shape - currently just the resume screen, but kept
 * generic since a second document step is a real possibility later. */
export function UploadScreen({
  heading,
  helperText,
  accept,
  optional,
  fileName,
  state,
  progress,
  statusLabel,
  errorMessage,
  onSelect,
  onRemove,
  onNext,
  onSkip,
  unavailable,
  autoFocus,
}: {
  heading: string;
  helperText: string;
  accept: string;
  optional: boolean;
  fileName: string | null;
  state: UploadState;
  progress: number | null;
  statusLabel?: string;
  errorMessage: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onNext: () => void;
  onSkip?: () => void;
  /** Shown instead of the file picker. Also releases Continue, so a required
   * step stays passable while uploads are down. */
  unavailable?: string;
  autoFocus?: boolean;
}) {
  // An error releases Continue as well: a file that couldn't be read is a
  // reason to ask for those fields by hand, not to trap the user on this step.
  const canContinue = Boolean(unavailable) || state === "done" || state === "error";

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl text-text-primary">{heading}</h1>
        {optional ? (
          <span className="utility-label text-text-secondary">(optional)</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-text-secondary">{helperText}</p>

      <div className="mt-6">
        {unavailable ? (
          <p className="w-full rounded-md border border-line bg-surface p-5 text-sm text-text-secondary">
            {unavailable}
          </p>
        ) : (
          <FileUpload
            accept={accept}
            fileName={fileName}
            state={state}
            progress={progress}
            statusLabel={statusLabel}
            errorMessage={errorMessage}
            onSelect={onSelect}
            onRemove={onRemove}
            autoFocus={autoFocus}
          />
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button type="button" onClick={onNext} disabled={!canContinue}>
          Continue
        </Button>
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="utility-label text-text-secondary hover:text-signal-teal"
          >
            Skip for now
          </button>
        ) : null}
      </div>
    </div>
  );
}
