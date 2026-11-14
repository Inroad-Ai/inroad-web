"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { CareerArcRole } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, OWNERSHIPS, PROJECT_STATUSES } from "@/lib/career-arc";

export function ProjectDetailsFields({
  role,
  onChange,
}: {
  role: CareerArcRole;
  onChange: (next: CareerArcRole) => void;
}) {
  const id = useId();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Status" htmlFor={`${id}-status`}>
        <Select
          id={`${id}-status`}
          className="w-full"
          value={role.status ?? ""}
          onChange={(event) =>
            onChange({ ...role, status: (event.target.value || null) as CareerArcRole["status"] })
          }
        >
          <option value="">Not set</option>
          {PROJECT_STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="I was" htmlFor={`${id}-ownership`}>
        <Select
          id={`${id}-ownership`}
          className="w-full"
          value={role.ownership ?? ""}
          onChange={(event) =>
            onChange({
              ...role,
              ownership: (event.target.value || null) as CareerArcRole["ownership"],
            })
          }
        >
          <option value="">Not set</option>
          {OWNERSHIPS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Team size" htmlFor={`${id}-team`}>
        <Input
          id={`${id}-team`}
          type="number"
          min={0}
          max={CAREER_ARC_LIMITS.teamSize}
          value={role.team_size ?? ""}
          onChange={(event) =>
            onChange({
              ...role,
              team_size: event.target.value === "" ? null : Number(event.target.value),
            })
          }
        />
      </Field>
      <Field label="Who uses it" htmlFor={`${id}-audience`}>
        <Input
          id={`${id}-audience`}
          value={role.audience ?? ""}
          maxLength={CAREER_ARC_LIMITS.detail}
          placeholder="About 40 beta users"
          onChange={(event) => onChange({ ...role, audience: event.target.value || null })}
        />
      </Field>
    </div>
  );
}
