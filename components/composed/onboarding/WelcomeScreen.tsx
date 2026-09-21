import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, DocumentSearchIcon, MessageIcon, TargetIcon } from "@/components/ui/Icons";
import { VALUE_PROPS } from "@/lib/onboarding";

// Matched to VALUE_PROPS by index - kept here rather than on the data array
// itself, since lib/ has no business importing UI icon components.
const VALUE_PROP_ICONS: ReactNode[] = [
  <TargetIcon key="target" />,
  <DocumentSearchIcon key="doc" />,
  <MessageIcon key="msg" />,
];

export function WelcomeScreen({
  phases,
  onStart,
}: {
  // The same phase list the progress indicator shows once the flow starts -
  // reused here instead of a hand-typed step count, so this line can't go
  // stale the next time a step gets added, split, or removed.
  phases: readonly string[];
  onStart: () => void;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
      <div>
        <h1 className="font-display text-[1.875rem] font-medium text-text-primary">
          Let&apos;s set you up
        </h1>
        <p className="mt-3 text-[0.9375rem] text-text-secondary">
          No queue, no black box - just a real message to a real person.
        </p>

        <div className="mt-8 border-t border-line">
          {VALUE_PROPS.map((prop, index) => (
            <div
              key={prop.title}
              className="animate-fade-up group flex gap-4 border-b border-line py-5 transition-colors hover:bg-surface-raised/60"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-text-secondary transition-colors group-hover:border-signal-teal group-hover:text-signal-teal">
                {VALUE_PROP_ICONS[index]}
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-text-primary">{prop.title}</p>
                <p className="mt-1 text-sm text-text-secondary">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button type="button" autoFocus onClick={onStart} className="gap-2">
            Let&apos;s go
            <ArrowRightIcon />
          </Button>
          <span className="text-xs text-text-secondary">
            About 2 minutes · you can edit anytime
          </span>
        </div>
      </div>

      <OnboardingVisual phases={phases} />
    </div>
  );
}

// A vertical timeline of the four sections ahead, with a progress line
// tracking how far in the current step preview is. No step is "active" yet
// on this screen (nothing has started), so the fill sits at the first node.
function OnboardingVisual({ phases }: { phases: readonly string[] }) {
  return (
    <div className="hidden lg:block">
      <div className="relative pl-4">
        <div
          className="absolute left-[calc(1rem+0.75rem)] top-3 bottom-3 w-px bg-line"
          aria-hidden="true"
        >
          <div
            className="w-px bg-signal-teal transition-[height] duration-500 ease-out"
            style={{ height: `${(1 / phases.length) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={phase} className="relative flex items-center gap-4">
              <span
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  index === 0
                    ? "border-signal-teal bg-signal-teal text-surface"
                    : "border-line bg-surface text-text-secondary"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-[0.9375rem] ${
                  index === 0 ? "font-medium text-text-primary" : "text-text-secondary"
                }`}
              >
                {phase}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 pl-4 text-xs text-text-secondary">Step 1 of {phases.length}</p>
    </div>
  );
}
