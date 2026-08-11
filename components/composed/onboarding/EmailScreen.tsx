"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail } from "@/lib/onboarding";

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
  const valid = isValidEmail(email);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What&apos;s your email?</h1>
      {prefilled ? (
        <p className="mt-2 text-sm text-text-secondary">
          Pulled from your Google sign-in. Change it if you&apos;d rather use another.
        </p>
      ) : null}
      <Input
        type="email"
        autoFocus
        value={email}
        onChange={(event) => onChange(event.target.value)}
        placeholder="you@example.com"
        className="mt-6"
      />
      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">That doesn&apos;t look like a real email.</p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
