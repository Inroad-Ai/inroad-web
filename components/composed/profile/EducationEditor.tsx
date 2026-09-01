"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import type { EducationEntry } from "@/lib/api-client/client";

const BLANK: EducationEntry = {
  institution: "",
  degree: "",
  field: "",
  start_date: "",
  end_date: "",
};

export function EducationEditor({
  entries,
  onChange,
}: {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}) {
  const idPrefix = useId();

  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add education"
      emptyLabel="Nothing here yet. Upload a resume during onboarding, or add it here."
    >
      {(entry, update, index) => {
        const institutionId = `${idPrefix}-${index}-institution`;
        const degreeId = `${idPrefix}-${index}-degree`;
        const fieldId = `${idPrefix}-${index}-field`;
        const startDateId = `${idPrefix}-${index}-start-date`;
        const endDateId = `${idPrefix}-${index}-end-date`;

        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution" htmlFor={institutionId}>
                <Input
                  id={institutionId}
                  value={entry.institution ?? ""}
                  onChange={(event) => update({ institution: event.target.value })}
                />
              </Field>
              <Field label="Degree" htmlFor={degreeId}>
                <Input
                  id={degreeId}
                  value={entry.degree ?? ""}
                  onChange={(event) => update({ degree: event.target.value })}
                />
              </Field>
            </div>
            <Field label="Field of study" htmlFor={fieldId}>
              <Input
                id={fieldId}
                value={entry.field ?? ""}
                onChange={(event) => update({ field: event.target.value })}
                placeholder="Computer Science"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date" htmlFor={startDateId}>
                <Input
                  id={startDateId}
                  value={entry.start_date ?? ""}
                  onChange={(event) => update({ start_date: event.target.value })}
                  placeholder="Sep 2020"
                />
              </Field>
              <Field label="End date" htmlFor={endDateId}>
                <Input
                  id={endDateId}
                  value={entry.end_date ?? ""}
                  onChange={(event) => update({ end_date: event.target.value })}
                  placeholder="Jun 2024 or Present"
                />
              </Field>
            </div>
          </>
        );
      }}
    </RepeatableList>
  );
}
