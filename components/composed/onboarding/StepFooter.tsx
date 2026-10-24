import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

/** Back on the left, the step's primary action on the right, anything optional between. */
export function StepFooter({
  onBack,
  primaryLabel = "Continue",
  onPrimary,
  isPrimaryDisabled = false,
  isLoading = false,
  children,
}: {
  onBack?: () => void;
  primaryLabel?: string;
  /** Omit to make the primary a submit button for the step's form. */
  onPrimary?: () => void;
  isPrimaryDisabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {onBack ? (
        <Button type="button" variant="ghost" icon={<ArrowLeftIcon />} onClick={onBack}>
          Back
        </Button>
      ) : null}
      {children}
      <Button
        type={onPrimary ? "button" : "submit"}
        onClick={onPrimary}
        disabled={isPrimaryDisabled}
        loading={isLoading}
        icon={<ArrowRightIcon />}
        iconPosition="end"
        className="ml-auto"
      >
        {primaryLabel}
      </Button>
    </div>
  );
}
