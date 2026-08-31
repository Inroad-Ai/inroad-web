"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateName } from "@/lib/onboarding-schema";

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
  const [touched, setTouched] = useState({ firstName: false, lastName: false });

  const firstNameError = touched.firstName ? validateName(firstName) : null;
  const lastNameError = touched.lastName ? validateName(lastName) : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched({ firstName: true, lastName: true });
        if (!validateName(firstName) && !validateName(lastName)) onNext();
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
            onChange={(event) => {
              onChange(event.target.value, lastName);
              setTouched((prev) => ({ ...prev, firstName: true }));
            }}
            className="mt-2"
          />
          {firstNameError ? <p className="mt-2 text-sm text-error">{firstNameError}</p> : null}
        </div>
        <div>
          <label htmlFor="last-name" className="utility-label text-text-secondary">
            Last name
          </label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(event) => {
              onChange(firstName, event.target.value);
              setTouched((prev) => ({ ...prev, lastName: true }));
            }}
            className="mt-2"
          />
          {lastNameError ? <p className="mt-2 text-sm text-error">{lastNameError}</p> : null}
        </div>
      </div>
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
