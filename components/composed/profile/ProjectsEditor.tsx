"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import { Textarea } from "@/components/ui/Textarea";
import { UrlInput } from "@/components/ui/UrlInput";
import type { ProjectEntry } from "@/lib/api-client/client";

const BLANK: ProjectEntry = {
  name: "",
  description: "",
  url: "",
  live_url: "",
  company: "",
};

export function ProjectsEditor({
  entries,
  onChange,
}: {
  entries: ProjectEntry[];
  onChange: (entries: ProjectEntry[]) => void;
}) {
  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add project"
      emptyLabel="Nothing here yet. Upload a resume during onboarding, or add it here."
    >
      {(entry, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={entry.name ?? ""}
                onChange={(event) => update({ name: event.target.value })}
              />
            </Field>
            <Field label="Repository link">
              <UrlInput
                value={entry.url ?? ""}
                onChange={(event) => update({ url: event.target.value })}
                placeholder="https://github.com/you/project"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Live project link">
              <UrlInput
                value={entry.live_url ?? ""}
                onChange={(event) => update({ live_url: event.target.value })}
                placeholder="https://project.example.com"
              />
            </Field>
            <Field label="Built for" hint="Leave blank if this is a personal project.">
              <Input
                value={entry.company ?? ""}
                onChange={(event) => update({ company: event.target.value })}
                placeholder="Company or organization"
              />
            </Field>
          </div>
          <Field label="What it does">
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
