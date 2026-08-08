"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  onRun: (domain: string) => void;
  busy: boolean;
  /** Keeps the field in step when a history row sets the domain. */
  value?: string;
}

export function SearchBar({ onRun, busy, value }: SearchBarProps) {
  const [domain, setDomain] = useState(value ?? "");

  // The field is uncontrolled while typing; this only pulls it back in line
  // when something outside sets the domain, e.g. a history row.
  useEffect(() => {
    if (value !== undefined) setDomain(value);
  }, [value]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = domain.trim();
    if (trimmed && !busy) onRun(trimmed);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="domain" className="sr-only">
        Company domain
      </label>
      <Input
        id="domain"
        name="domain"
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        placeholder="stripe.com"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={busy}
      />
      <Button type="submit" disabled={busy || domain.trim().length === 0}>
        {busy ? "Checking..." : "Run research"}
      </Button>
    </form>
  );
}
