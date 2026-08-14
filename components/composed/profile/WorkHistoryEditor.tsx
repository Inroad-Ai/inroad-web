"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import { Textarea } from "@/components/ui/Textarea";
import type { WorkHistoryEntry } from "@/lib/api-client/client";

const BLANK: WorkHistoryEntry = {
  company: "",
  title: "",
  start_date: "",
  end_date: "",
  description: "",
};

export function WorkHistoryEditor({
  entries,
  onChange,
}: {
  entries: WorkHistoryEntry[];
  onChange: (entries: WorkHistoryEntry[]) => void;
}) {
  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add a role"
      emptyLabel="No roles yet. Upload a resume during onboarding, or add them here."
    >
      {(entry, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <Input
                value={entry.company ?? ""}
                onChange={(event) => update({ company: event.target.value })}
              />
            </Field>
            <Field label="Title">
              <Input
                value={entry.title ?? ""}
                onChange={(event) => update({ title: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Free text, not a date picker: these come off a resume reading
                "Mar 2021" or "present", and the column stores them as-is. */}
            <Field label="Start">
              <Input
                value={entry.start_date ?? ""}
                onChange={(event) => update({ start_date: event.target.value })}
                placeholder="Mar 2021"
              />
            </Field>
            <Field label="End">
              <Input
                value={entry.end_date ?? ""}
                onChange={(event) => update({ end_date: event.target.value })}
                placeholder="Present"
              />
            </Field>
          </div>
          <Field label="What you did">
            <Textarea
              rows={3}
              value={entry.description ?? ""}
              onChange={(event) => update({ description: event.target.value })}
            />
          </Field>
        </>
      )}
    </RepeatableList>
  );
}
