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
      <p className="mt-2 text-sm text-text-secondary">
        This is how we&apos;ll sign the outreach we draft for you.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="first-name" className="utility-label text-text-secondary">
            First name
          </label>
          <Input
            id="first-name"
            autoFocus
            value={firstName}
            aria-invalid={firstNameError ? true : undefined}
            aria-describedby={firstNameError ? "first-name-error" : undefined}
            onChange={(event) => {
              onChange(event.target.value, lastName);
              setTouched((prev) => ({ ...prev, firstName: true }));
            }}
            className="mt-2"
          />
          {firstNameError ? (
            <p id="first-name-error" className="mt-2 text-sm text-error" aria-live="polite">
              {firstNameError}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="last-name" className="utility-label text-text-secondary">
            Last name
          </label>
          <Input
            id="last-name"
            value={lastName}
            aria-invalid={lastNameError ? true : undefined}
            aria-describedby={lastNameError ? "last-name-error" : undefined}
            onChange={(event) => {
              onChange(firstName, event.target.value);
              setTouched((prev) => ({ ...prev, lastName: true }));
            }}
            className="mt-2"
          />
          {lastNameError ? (
            <p id="last-name-error" className="mt-2 text-sm text-error" aria-live="polite">
              {lastNameError}
            </p>
          ) : null}
        </div>
      </div>
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
