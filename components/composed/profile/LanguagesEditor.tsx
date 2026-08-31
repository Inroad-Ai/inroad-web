"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import type { LanguageEntry } from "@/lib/api-client/client";

const PROFICIENCIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "professional", label: "Professional" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
] as const;

const BLANK: LanguageEntry = {
  language: "",
  proficiency: null,
};

export function LanguagesEditor({
  entries,
  onChange,
}: {
  entries: LanguageEntry[];
  onChange: (entries: LanguageEntry[]) => void;
}) {
  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add language"
      emptyLabel="No languages added yet."
    >
      {(entry, update) => (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Field label="Language">
            <Input
              value={entry.language ?? ""}
              onChange={(event) => update({ language: event.target.value })}
              placeholder="English"
            />
          </Field>
          <Field label="Proficiency">
            <div className="flex flex-wrap gap-2">
              {PROFICIENCIES.map((option) => {
                const selected = entry.proficiency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ proficiency: option.value })}
                    className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                      selected
                        ? "border-signal-teal bg-signal-teal-subtle text-signal-teal"
                        : "border-line bg-surface text-text-secondary hover:border-signal-teal/60 hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      )}
    </RepeatableList>
  );
}
