"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface ProfileLinks {
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

const FIELDS: { key: keyof ProfileLinks; label: string; placeholder: string }[] = [
  { key: "linkedinUrl", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "githubUrl", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "portfolioUrl", label: "Portfolio or site", placeholder: "https://yoursite.com" },
];

export function LinksScreen({
  links,
  onChange,
  onNext,
}: {
  links: ProfileLinks;
  onChange: (links: ProfileLinks) => void;
  onNext: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <h1 className="font-display text-2xl text-text-primary">Where can people find you?</h1>
      <p className="mt-2 text-sm text-text-secondary">
        All optional. Anything your resume listed is already filled in.
      </p>
      <div className="mt-6 space-y-4">
        {FIELDS.map((field, index) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="utility-label text-text-secondary">
              {field.label}
            </label>
            <Input
              id={field.key}
              type="url"
              autoFocus={index === 0}
              value={links[field.key]}
              onChange={(event) => onChange({ ...links, [field.key]: event.target.value })}
              placeholder={field.placeholder}
              className="mt-2"
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
