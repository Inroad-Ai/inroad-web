"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import type { CareerArcDocument } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, WORKING_STYLE_PROMPTS } from "@/lib/career-arc";

import { RecognitionEditor } from "./RecognitionEditor";

type StyleKey = "feedback" | "communication" | "decisions" | "energizes" | "drains";

/** The parts of a career arc that belong to no single chapter. */
export function BigPictureEditor({
  document,
  onChange,
}: {
  document: CareerArcDocument;
  onChange: (next: CareerArcDocument) => void;
}) {
  const id = useId();
  const style = document.working_style ?? {};

  return (
    <div className="space-y-6">
      <Field label="Summary" htmlFor={`${id}-story`} hint="Your career in your own words.">
        <Textarea
          id={`${id}-story`}
          value={document.story ?? ""}
          maxLength={CAREER_ARC_LIMITS.intro}
          onChange={(event) => onChange({ ...document, story: event.target.value || null })}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What I am looking for" htmlFor={`${id}-looking`}>
          <Textarea
            id={`${id}-looking`}
            className="min-h-20"
            value={document.looking_for ?? ""}
            maxLength={CAREER_ARC_LIMITS.lookingFor}
            onChange={(event) => onChange({ ...document, looking_for: event.target.value || null })}
          />
        </Field>
        <Field
          label="What I am not looking for"
          htmlFor={`${id}-not-looking`}
          hint="Deal-breakers: no on-call, no relocation."
        >
          <Textarea
            id={`${id}-not-looking`}
            className="min-h-20"
            value={document.not_looking_for ?? ""}
            maxLength={CAREER_ARC_LIMITS.notLookingFor}
            onChange={(event) =>
              onChange({ ...document, not_looking_for: event.target.value || null })
            }
          />
        </Field>
      </div>

      <Field label="Themes that repeat" hint="Press Enter after each one.">
        <TagInput
          value={document.themes ?? []}
          onChange={(next) =>
            onChange({ ...document, themes: next.slice(0, CAREER_ARC_LIMITS.themes) })
          }
          placeholder="Measure first"
        />
      </Field>
      <Field label="Principles" hint="Rules you work by.">
        <TagInput
          value={document.principles ?? []}
          onChange={(next) =>
            onChange({ ...document, principles: next.slice(0, CAREER_ARC_LIMITS.principles) })
          }
          placeholder="A number without a method is a guess"
        />
      </Field>
      <Field label="Skills" hint="Tools and technologies.">
        <TagInput
          value={document.skills ?? []}
          onChange={(next) =>
            onChange({ ...document, skills: next.slice(0, CAREER_ARC_LIMITS.skills) })
          }
          placeholder="Kafka"
        />
      </Field>

      <div>
        <p className="text-sm font-sans-semibold text-ink">How I work</p>
        <p className="mt-1 text-xs text-ink-muted">Short answers. Skip any you like.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {WORKING_STYLE_PROMPTS.map(({ key, label, hint }) => (
            <Field key={key} label={label} hint={hint} htmlFor={`${id}-${key}`}>
              <Textarea
                id={`${id}-${key}`}
                className="min-h-16"
                value={style[key as StyleKey] ?? ""}
                maxLength={CAREER_ARC_LIMITS.workingStyle}
                onChange={(event) =>
                  onChange({
                    ...document,
                    working_style: { ...style, [key]: event.target.value || null },
                  })
                }
              />
            </Field>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-sans-semibold text-ink">Recognition</p>
        <p className="mt-1 mb-3 text-xs text-ink-muted">Awards, rankings, certifications, talks.</p>
        <RecognitionEditor
          items={document.recognition ?? []}
          onChange={(recognition) => onChange({ ...document, recognition })}
        />
      </div>
    </div>
  );
}
