"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { TagInput } from "@/components/ui/TagInput";

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

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What roles are you targeting?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Whatever you&apos;d put at the top of your resume right now. Add as many as apply.
      </p>
      <div className="mt-6">
        <TagInput value={targetRoles} onChange={onChange} placeholder="Backend Engineer" />
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
