"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";

export function WorkPreferenceScreen({
  selected,
  onChange,
  onNext,
}: {
  selected: WorkPreferenceOption[];
  onChange: (next: WorkPreferenceOption[]) => void;
  onNext: () => void;
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
    <div>
      <h1 className="font-display text-2xl text-text-primary">What work arrangement fits?</h1>
      <p className="mt-2 text-sm text-text-secondary">Pick as many as apply.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {WORK_PREFERENCE_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            selected={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </SelectableCard>
        ))}
      </div>

      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">Pick at least one.</p>
      ) : null}

      <Button
        type="button"
        className="mt-8"
        onClick={() => {
          setTouched(true);
          if (valid) onNext();
        }}
      >
        Continue
      </Button>
    </div>
  );
}
