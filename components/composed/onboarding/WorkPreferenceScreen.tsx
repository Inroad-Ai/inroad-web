"use client";

import { useState } from "react";

import { Notice } from "@/components/ui/Notice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function WorkPreferenceScreen({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: WorkPreferenceOption[];
  onChange: (next: WorkPreferenceOption[]) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const valid = selected.length > 0;

  function toggle(option: WorkPreferenceOption) {
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <StepHeading title="How do you want to work?">
        This narrows which companies we search for. Pick as many as apply.
      </StepHeading>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {WORK_PREFERENCE_OPTIONS.map((option, index) => (
          <SelectableCard
            key={option.value}
            selected={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
            autoFocus={index === 0}
          >
            <span className="block font-display text-lg font-sans-semibold tracking-heading">
              {option.label}
            </span>
            <span className="mt-1 block text-sm text-ink-muted">{option.description}</span>
          </SelectableCard>
        ))}
      </div>

      {touched && !valid ? <Notice className="mt-3">Pick at least one.</Notice> : null}

      <StepFooter onBack={onBack} />
    </form>
  );
}
