import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import type { UploadState } from "@/lib/onboarding";

/** Shared shape for the resume screen and the career-arc screen - same upload pattern, different copy and required-ness. */
export function UploadScreen({
  heading,
  helperText,
  accept,
  optional,
  fileName,
  state,
  progress,
  errorMessage,
  onSelect,
  onRemove,
  onNext,
  onSkip,
}: {
  heading: string;
  helperText: string;
  accept: string;
  optional: boolean;
  fileName: string | null;
  state: UploadState;
  progress: number;
  errorMessage: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onNext: () => void;
  onSkip?: () => void;
}) {
  const canContinue = state === "done";

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
        <FileUpload
          accept={accept}
          fileName={fileName}
          state={state}
          progress={progress}
          errorMessage={errorMessage}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button type="button" onClick={onNext} disabled={!canContinue}>
          Continue
        </Button>
        {optional && onSkip ? (
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
