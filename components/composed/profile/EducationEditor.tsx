"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import type { EducationEntry } from "@/lib/api-client/client";

const BLANK: EducationEntry = {
  institution: "",
  degree: "",
  field: "",
  end_date: "",
};

export function EducationEditor({
  entries,
  onChange,
}: {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}) {
  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add education"
      emptyLabel="Nothing here yet. Upload a resume during onboarding, or add it here."
    >
      {(entry, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Institution">
              <Input
                value={entry.institution ?? ""}
                onChange={(event) => update({ institution: event.target.value })}
              />
            </Field>
            <Field label="Degree">
              <Input
                value={entry.degree ?? ""}
                onChange={(event) => update({ degree: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Field of study">
              <Input
                value={entry.field ?? ""}
                onChange={(event) => update({ field: event.target.value })}
              />
            </Field>
            <Field label="Finished">
              <Input
                value={entry.end_date ?? ""}
                onChange={(event) => update({ end_date: event.target.value })}
                placeholder="2019"
              />
            </Field>
          </div>
        </>
      )}
    </RepeatableList>
  );
}
