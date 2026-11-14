"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import type { CareerArcRole } from "@/lib/api-client/client";
import {
  CAREER_ARC_LIMITS,
  CAUSE_KINDS,
  FIELD_LABELS,
  PROJECT_KINDS,
  ROLE_KINDS,
} from "@/lib/career-arc";

import { CauseDetailsFields } from "./CauseDetailsFields";
import { ProjectDetailsFields } from "./ProjectDetailsFields";

type TextKey = "organization" | "role" | "start_date" | "end_date";

const TEXT_FIELDS: TextKey[] = ["organization", "role", "start_date", "end_date"];

export function RoleEditor({
  role,
  onChange,
}: {
  role: CareerArcRole;
  onChange: (next: CareerArcRole) => void;
}) {
  const id = useId();
  const kind = role.kind ?? "job";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((key) => (
          <Field key={key} label={FIELD_LABELS[key]} htmlFor={`${id}-${key}`}>
            <Input
              id={`${id}-${key}`}
              value={role[key] ?? ""}
              maxLength={CAREER_ARC_LIMITS.shortField}
              onChange={(event) => onChange({ ...role, [key]: event.target.value || null })}
            />
          </Field>
        ))}
        <Field label="Kind" htmlFor={`${id}-kind`}>
          <Select
            id={`${id}-kind`}
            className="w-full"
            value={kind}
            onChange={(event) =>
              onChange({ ...role, kind: event.target.value as CareerArcRole["kind"] })
            }
          >
            {ROLE_KINDS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex items-center gap-3 self-end pb-2">
          <Switch
            checked={role.is_current ?? false}
            label="Still going"
            onChange={(next) => onChange({ ...role, is_current: next })}
          />
          <span className="text-sm text-ink">Still going</span>
        </div>
      </div>

      {PROJECT_KINDS.includes(kind) ? (
        <ProjectDetailsFields role={role} onChange={onChange} />
      ) : null}
      {CAUSE_KINDS.includes(kind) ? <CauseDetailsFields role={role} onChange={onChange} /> : null}

      <Field
        label="Overview"
        htmlFor={`${id}-overview`}
        hint="What it was, and why it mattered or why you did it."
      >
        <Textarea
          id={`${id}-overview`}
          className="min-h-20"
          value={role.overview ?? ""}
          maxLength={CAREER_ARC_LIMITS.overview}
          onChange={(event) => onChange({ ...role, overview: event.target.value || null })}
        />
      </Field>

      <Field label="Tools and skills" hint="Press Enter after each one.">
        <TagInput
          value={role.stack ?? []}
          onChange={(stack) =>
            onChange({ ...role, stack: stack.slice(0, CAREER_ARC_LIMITS.stack) })
          }
          placeholder="Node.js, PostgreSQL, public speaking"
        />
      </Field>

      <Field label="Links" hint="A repo, a demo, a write-up.">
        <TagInput
          value={role.links ?? []}
          onChange={(links) =>
            onChange({ ...role, links: links.slice(0, CAREER_ARC_LIMITS.links) })
          }
          placeholder="https://"
        />
      </Field>
    </div>
  );
}
