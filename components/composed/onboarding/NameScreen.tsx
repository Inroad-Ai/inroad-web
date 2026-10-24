"use client";

import { useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { validateName } from "@/lib/onboarding-schema";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function NameScreen({
  firstName,
  lastName,
  onChange,
  onNext,
  onBack,
}: {
  firstName: string;
  lastName: string;
  onChange: (firstName: string, lastName: string) => void;
  onNext: () => void;
  onBack?: () => void;
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
      <StepHeading title="What's your name?">
        This is how we&apos;ll sign the outreach we draft for you.
      </StepHeading>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          htmlFor="first-name"
          error={firstNameError}
          errorId="first-name-error"
        >
          <Input
            id="first-name"
            autoFocus
            autoComplete="given-name"
            value={firstName}
            aria-invalid={firstNameError ? true : undefined}
            aria-describedby={firstNameError ? "first-name-error" : undefined}
            onChange={(event) => {
              onChange(event.target.value, lastName);
              setTouched((prev) => ({ ...prev, firstName: true }));
            }}
          />
        </Field>
        <Field
          label="Last name"
          htmlFor="last-name"
          error={lastNameError}
          errorId="last-name-error"
        >
          <Input
            id="last-name"
            autoComplete="family-name"
            value={lastName}
            aria-invalid={lastNameError ? true : undefined}
            aria-describedby={lastNameError ? "last-name-error" : undefined}
            onChange={(event) => {
              onChange(firstName, event.target.value);
              setTouched((prev) => ({ ...prev, lastName: true }));
            }}
          />
        </Field>
      </div>
      <StepFooter onBack={onBack} />
    </form>
  );
}
