"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateLocation } from "@/lib/onboarding-schema";

export function LocationScreen({
  location,
  onChange,
  onNext,
}: {
  location: string;
  onChange: (location: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validateLocation(location) : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!validateLocation(location)) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">Where are you based?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        City and country is enough. It narrows which companies are worth writing to.
      </p>
      <Input
        autoFocus
        value={location}
        onChange={(event) => {
          onChange(event.target.value);
          setTouched(true);
        }}
        placeholder="Berlin, Germany"
        className="mt-6"
      />
      {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
