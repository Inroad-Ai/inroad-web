import type { ReactNode } from "react";

import { ArrowLeftIcon } from "@/components/ui/Icons";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";

/**
 * Chrome shared by every onboarding screen: progress, an optional back
 * button, and the fade-in on mount. The parent remounts this per step (via a
 * `key`) so the fade replays on every advance/back.
 */
export function ScreenShell({
  step,
  total,
  phases,
  currentPhaseIndex,
  onBack,
  wide = false,
  children,
}: {
  step: number;
  total: number;
  phases: readonly string[];
  currentPhaseIndex: number;
  onBack?: () => void;
  // The welcome screen carries a two-column layout (copy + visual panel)
  // that the max-w-xl single-column form steps would crush.
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`animate-fade-up mx-auto flex min-h-screen w-full flex-col justify-center px-6 py-16 ${wide ? "max-w-wide" : "max-w-xl"}`}
    >
      <div className="mb-10">
        <ProgressIndicator
          step={step}
          total={total}
          phases={phases}
          currentPhaseIndex={currentPhaseIndex}
        />
      </div>

      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-signal-teal"
        >
          <ArrowLeftIcon />
          Back
        </button>
      ) : null}

      {children}
    </div>
  );
}
