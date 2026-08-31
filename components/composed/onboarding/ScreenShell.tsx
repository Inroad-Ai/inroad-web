import type { ReactNode } from "react";

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
  children,
}: {
  step: number;
  total: number;
  phases: readonly string[];
  currentPhaseIndex: number;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="animate-fade-up mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
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
          className="utility-label mb-6 inline-flex w-fit items-center gap-1 text-text-secondary hover:text-signal-teal"
        >
          ← Back
        </button>
      ) : null}

      {children}
    </div>
  );
}
