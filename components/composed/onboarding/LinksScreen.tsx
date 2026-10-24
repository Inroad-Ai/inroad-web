"use client";

import { useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { LINK_FIELDS, type ProfileLinks } from "@/lib/onboarding";
import { validateUrl } from "@/lib/onboarding-schema";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function LinksScreen({
  links,
  onChange,
  onNext,
  onBack,
}: {
  links: ProfileLinks;
  onChange: (links: ProfileLinks) => void;
  onNext: () => void;
  onBack?: () => void;
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
      <StepHeading title="Where can people find you?">
        All optional. Anything your resume listed is already filled in.
      </StepHeading>
      <div className="mt-7 grid gap-4">
        {LINK_FIELDS.map((field, index) => {
          const error = errorFor(field.key);
          return (
            <Field
              key={field.key}
              label={field.label}
              htmlFor={field.key}
              error={error}
              errorId={`${field.key}-error`}
            >
              <Input
                id={field.key}
                type="url"
                autoFocus={index === 0}
                value={links[field.key]}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${field.key}-error` : undefined}
                onChange={(event) => {
                  onChange({ ...links, [field.key]: event.target.value });
                  setTouched((prev) => ({ ...prev, [field.key]: true }));
                }}
                placeholder={field.placeholder}
              />
            </Field>
          );
        })}
      </div>
      <StepFooter onBack={onBack} />
    </form>
  );
}
