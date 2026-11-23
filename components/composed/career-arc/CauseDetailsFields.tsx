"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { CareerArcRole } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, FIELD_LABELS } from "@/lib/career-arc";

type CauseKey = "cause" | "commitment" | "reach";

const FIELDS: { key: CauseKey; placeholder: string }[] = [
  { key: "cause", placeholder: "Help first-year students learn to code" },
  { key: "commitment", placeholder: "4 hours a week" },
  { key: "reach", placeholder: "120 students over 2 years" },
];

export function CauseDetailsFields({
  role,
  onChange,
}: {
  role: CareerArcRole;
  onChange: (next: CareerArcRole) => void;
}) {
  const id = useId();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {FIELDS.map(({ key, placeholder }) => (
        <Field key={key} label={FIELD_LABELS[key]} htmlFor={`${id}-${key}`}>
          <Input
            id={`${id}-${key}`}
            value={role[key] ?? ""}
            maxLength={CAREER_ARC_LIMITS.detail}
            placeholder={placeholder}
            onChange={(event) => onChange({ ...role, [key]: event.target.value || null })}
          />
        </Field>
      ))}
    </div>
  );
}
