"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/onboarding-schema";

export function EmailScreen({
  email,
  prefilled,
  onChange,
  onNext,
}: {
  email: string;
  prefilled: boolean;
  onChange: (email: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validateEmail(email) : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!validateEmail(email)) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What&apos;s your email?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Confirmations and password resets go here. We never share it.
      </p>
      {prefilled ? (
        <p className="mt-2 text-sm text-text-secondary">
          Pulled from your Google sign-in. Change it if you&apos;d rather use another.
        </p>
      ) : null}
      <Input
        type="email"
        autoFocus
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
        className="mt-6"
      />
      {error ? (
        <p id="email-error" className="mt-3 text-sm text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
