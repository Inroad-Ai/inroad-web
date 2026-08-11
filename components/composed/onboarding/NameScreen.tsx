"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NameScreen({
  firstName,
  lastName,
  onChange,
  onNext,
}: {
  firstName: string;
  lastName: string;
  onChange: (firstName: string, lastName: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const valid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What&apos;s your name?</h1>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="first-name" className="utility-label text-text-secondary">
            First name
          </label>
          <Input
            id="first-name"
            autoFocus
            value={firstName}
            onChange={(event) => onChange(event.target.value, lastName)}
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="utility-label text-text-secondary">
            Last name
          </label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(event) => onChange(firstName, event.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">Both names are needed to continue.</p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
