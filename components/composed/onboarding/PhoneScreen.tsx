"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validatePhone } from "@/lib/onboarding-schema";

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
  const error = touched ? validatePhone(phone) : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!validatePhone(phone)) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">What&apos;s your phone number?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        For account recovery only, nobody calls you unprompted.
      </p>
      <Input
        type="tel"
        autoFocus
        value={phone}
        onChange={(event) => {
          onChange(event.target.value);
          setTouched(true);
        }}
        placeholder="(555) 123-4567"
        className="mt-6"
      />
      {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
