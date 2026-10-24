"use client";

import { useState } from "react";

import { Notice } from "@/components/ui/Notice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { TagInput } from "@/components/ui/TagInput";
import { COMMON_TARGET_ROLES } from "@/lib/onboarding";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function TargetRoleScreen({
  targetRoles,
  onChange,
  onNext,
  onBack,
}: {
  targetRoles: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack?: () => void;
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
      <StepHeading title="What roles should we find for you?">
        This is what we search for. Pick any that fit, or add your own below. The more specific, the
        better the matches.
      </StepHeading>
      <ul className="mt-7 flex flex-wrap gap-2" aria-label="Common roles">
        {COMMON_TARGET_ROLES.map((role, index) => (
          <li key={role}>
            <SelectableCard
              compact
              selected={targetRoles.includes(role)}
              onClick={() => toggleRole(role)}
              autoFocus={index === 0}
            >
              {role}
            </SelectableCard>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <TagInput value={targetRoles} onChange={onChange} placeholder="Or type your own" />
      </div>
      {touched && !valid ? <Notice className="mt-3">Add at least one role.</Notice> : null}
      <StepFooter onBack={onBack} />
    </form>
  );
}
