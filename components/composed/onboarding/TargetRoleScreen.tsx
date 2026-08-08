"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TargetRoleScreen({
  targetRole,
  onChange,
  onNext,
}: {
  targetRole: string;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const valid = targetRole.trim().length > 1;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-mono text-2xl text-text-primary">What role are you targeting?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Whatever you&apos;d put at the top of your resume right now.
      </p>
      <Input
        autoFocus
        value={targetRole}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Backend Engineer"
        className="mt-6"
      />
      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">Give it a title, even a rough one.</p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
