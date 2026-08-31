"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { TagInput } from "@/components/ui/TagInput";
import { COMMON_TARGET_ROLES } from "@/lib/onboarding";

export function TargetRoleScreen({
  targetRoles,
  onChange,
  onNext,
}: {
  targetRoles: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const valid = targetRoles.length > 0;

  function toggleRole(role: string) {
    if (targetRoles.includes(role)) {
      onChange(targetRoles.filter((existing) => existing !== role));
    } else {
      onChange([...targetRoles, role]);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What roles should we find for you?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        This is what we search for. Pick any that fit, or add your own below - the
        more specific, the better the matches.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {COMMON_TARGET_ROLES.map((role) => {
          const selected = targetRoles.includes(role);
          return (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              aria-pressed={selected}
              className={
                selected
                  ? "utility-label rounded-full border border-signal-teal/40 bg-signal-teal/10 px-3 py-1.5 text-signal-teal"
                  : "utility-label rounded-full border border-line bg-surface px-3 py-1.5 text-text-secondary hover:border-signal-teal hover:text-signal-teal"
              }
            >
              {selected ? "✓ " : "+ "}
              {role}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <TagInput
          value={targetRoles}
          onChange={onChange}
          placeholder="Or type your own"
          autoFocus
        />
      </div>
      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">Add at least one role.</p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
