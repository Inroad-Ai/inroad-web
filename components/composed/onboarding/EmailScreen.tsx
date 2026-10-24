"use client";

import { useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/onboarding-schema";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function EmailScreen({
  email,
  prefilled,
  onChange,
  onNext,
  onBack,
}: {
  email: string;
  prefilled: boolean;
  onChange: (email: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validateEmail(email) : null;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!validateEmail(email)) onNext();
      }}
    >
      <StepHeading title="What's your email?">
        <p>Confirmations and password resets go here. We never share it.</p>
        {prefilled ? (
          <p className="mt-2 text-sm">
            Pulled from your Google sign-in. Change it if you&apos;d rather use another.
          </p>
        ) : null}
      </StepHeading>
      <div className="mt-7">
        <Field label="Email" htmlFor="onboarding-email" error={error} errorId="email-error">
          <Input
            id="onboarding-email"
            type="email"
            autoFocus
            autoComplete="email"
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "email-error" : undefined}
            onChange={(event) => {
              onChange(event.target.value);
              // Once the user has started typing, feedback stays live on every
              // keystroke instead of waiting for a submit attempt.
              setTouched(true);
            }}
            placeholder="you@example.com"
          />
        </Field>
      </div>
      <StepFooter onBack={onBack} />
    </form>
  );
}
