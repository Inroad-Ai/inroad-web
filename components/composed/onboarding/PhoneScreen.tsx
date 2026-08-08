"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidPhone } from "@/lib/onboarding";

export function PhoneScreen({
  phone,
  onChange,
  onNext,
}: {
  phone: string;
  onChange: (phone: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const valid = isValidPhone(phone);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onNext();
      }}
    >
      <h1 className="font-mono text-2xl text-text-primary">What&apos;s your phone number?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        For account recovery only, nobody calls you unprompted.
      </p>
      <Input
        type="tel"
        autoFocus
        value={phone}
        onChange={(event) => onChange(event.target.value)}
        placeholder="(555) 123-4567"
        className="mt-6"
      />
      {touched && !valid ? (
        <p className="mt-3 text-sm text-error">That doesn&apos;t look like a phone number.</p>
      ) : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
