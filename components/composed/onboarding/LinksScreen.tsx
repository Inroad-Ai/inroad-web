"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LINK_FIELDS, type ProfileLinks } from "@/lib/onboarding";
import { validateUrl } from "@/lib/onboarding-schema";

export function LinksScreen({
  links,
  onChange,
  onNext,
}: {
  links: ProfileLinks;
  onChange: (links: ProfileLinks) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileLinks, boolean>>>({});

  function errorFor(key: keyof ProfileLinks): string | null {
    return touched[key] ? validateUrl(links[key]) : null;
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTouched({ linkedinUrl: true, githubUrl: true, portfolioUrl: true });
        const hasError = LINK_FIELDS.some((field) => validateUrl(links[field.key]));
        if (!hasError) onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">Where can people find you?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        All optional. Anything your resume listed is already filled in.
      </p>
      <div className="mt-6 space-y-4">
        {LINK_FIELDS.map((field, index) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="utility-label text-text-secondary">
              {field.label}
            </label>
            <Input
              id={field.key}
              type="url"
              autoFocus={index === 0}
              value={links[field.key]}
              aria-invalid={errorFor(field.key) ? true : undefined}
              aria-describedby={errorFor(field.key) ? `${field.key}-error` : undefined}
              onChange={(event) => {
                onChange({ ...links, [field.key]: event.target.value });
                setTouched((prev) => ({ ...prev, [field.key]: true }));
              }}
              placeholder={field.placeholder}
              className="mt-2"
            />
            {errorFor(field.key) ? (
              <p id={`${field.key}-error`} className="mt-2 text-sm text-error" aria-live="polite">
                {errorFor(field.key)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
