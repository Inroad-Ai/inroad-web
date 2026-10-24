import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FileUpload";
import type { UploadState } from "@/lib/onboarding";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

/** The file-upload step shape: currently just the resume screen, kept
 * generic since a second document step is a real possibility later. */
export function UploadScreen({
  heading,
  helperText,
  accept,
  optional,
  fileName,
  fileSize,
  state,
  errorMessage,
  onSelect,
  onRemove,
  onRetry,
  onNext,
  onBack,
  onSkip,
  unavailable,
  autoFocus,
}: {
  heading: string;
  helperText: string;
  accept: string;
  optional: boolean;
  fileName: string | null;
  fileSize?: number | null;
  state: UploadState;
  errorMessage: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onRetry?: () => void;
  onNext: () => void;
  onBack?: () => void;
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
      <StepHeading
        title={heading}
        aside={optional ? <span className="utility-label text-ink-faint">Optional</span> : null}
      >
        {helperText}
      </StepHeading>

      <div className="mt-7">
        {unavailable ? (
          <Card variant="nested" padding="md" className="text-sm text-ink-muted">
            {unavailable}
          </Card>
        ) : (
          <FileUpload
            accept={accept}
            fileName={fileName}
            fileSize={fileSize}
            state={state}
            errorMessage={errorMessage}
            onSelect={onSelect}
            onRemove={onRemove}
            onRetry={onRetry}
            autoFocus={autoFocus}
          />
        )}
      </div>

      <StepFooter onBack={onBack} onPrimary={onNext} isPrimaryDisabled={!canContinue}>
        {onSkip ? (
          <Button type="button" variant="quiet" onClick={onSkip}>
            Skip for now
          </Button>
        ) : null}
      </StepFooter>
    </div>
  );
}
