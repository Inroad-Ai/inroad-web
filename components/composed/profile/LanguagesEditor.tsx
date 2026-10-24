"use client";

import { useId } from "react";

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
  const idPrefix = useId();

  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add language"
      emptyLabel="No languages added yet."
    >
      {(entry, update, index) => {
        const languageId = `${idPrefix}-${index}-language`;
        const proficiencyLabelId = `${idPrefix}-${index}-proficiency-label`;

        return (
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Language" htmlFor={languageId}>
              <Input
                id={languageId}
                value={entry.language ?? ""}
                onChange={(event) => update({ language: event.target.value })}
                placeholder="English"
              />
            </Field>
            <div className="min-w-0 lg:col-span-2">
              <Field label="Proficiency" labelId={proficiencyLabelId}>
                <div
                  role="group"
                  aria-labelledby={proficiencyLabelId}
                  className="flex flex-wrap gap-2"
                >
                  {PROFICIENCIES.map((option) => {
                    const selected = entry.proficiency === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update({ proficiency: option.value })}
                        className={`min-h-9 rounded-full border px-3.5 py-1.5 text-xs font-sans-semibold transition-colors duration-fast ${
                          selected
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/15 bg-ink/5 text-ink-muted hover:border-ink/40 hover:text-ink"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>
        );
      }}
    </RepeatableList>
  );
}
