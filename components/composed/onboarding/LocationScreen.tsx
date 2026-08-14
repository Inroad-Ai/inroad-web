"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LocationScreen({
  location,
  onChange,
  onNext,
}: {
  location: string;
  onChange: (location: string) => void;
  onNext: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">Where are you based?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        City and country is enough. It narrows which companies are worth writing to.
      </p>
      <Input
        autoFocus
        value={location}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Berlin, Germany"
        className="mt-6"
      />
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
