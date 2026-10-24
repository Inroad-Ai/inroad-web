import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon, DocumentSearchIcon, MessageIcon, TargetIcon } from "@/components/ui/Icons";
import { VALUE_PROPS } from "@/lib/onboarding";

import { StepHeading } from "./StepHeading";

// Matched to VALUE_PROPS by index: lib/ has no business importing UI icons.
const VALUE_PROP_ICONS: ReactNode[] = [
  <TargetIcon key="target" />,
  <DocumentSearchIcon key="doc" />,
  <MessageIcon key="msg" />,
];

export function WelcomeScreen({
  phases,
  onStart,
}: {
  // The progress bar's own phase list, so this preview can't drift from it.
  phases: readonly string[];
  onStart: () => void;
}) {
  return (
    <div>
      <StepHeading title="Let's set you up">
        No queue, no black box. Just a real message to a real person.
      </StepHeading>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {VALUE_PROPS.map((prop, index) => (
          <Card as="li" key={prop.title} variant="nested" padding="sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-nest bg-surface text-signal-teal shadow-nest">
              {VALUE_PROP_ICONS[index]}
            </span>
            <p className="mt-3 font-display text-base font-sans-semibold tracking-heading text-ink">
              {prop.title}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{prop.description}</p>
          </Card>
        ))}
      </ul>

      <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="What's ahead">
        {phases.map((phase, index) => (
          <li key={phase} className="utility-label flex items-center gap-2 text-ink-muted">
            <span className="text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
            {phase}
            {index < phases.length - 1 ? <span aria-hidden className="h-px w-4 bg-line" /> : null}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button
          type="button"
          autoFocus
          onClick={onStart}
          icon={<ArrowRightIcon />}
          iconPosition="end"
        >
          Let&apos;s go
        </Button>
        <span className="text-xs text-ink-muted">About 2 minutes · you can edit anytime</span>
      </div>
    </div>
  );
}
