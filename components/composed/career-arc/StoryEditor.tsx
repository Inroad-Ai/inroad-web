"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import type { CareerArcStory } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, STORY_PARTS } from "@/lib/career-arc";

export function StoryEditor({
  story,
  onChange,
}: {
  story: CareerArcStory;
  onChange: (next: CareerArcStory) => void;
}) {
  const id = useId();

  function change(changes: Partial<CareerArcStory>) {
    onChange({
      ...story,
      ...changes,
      source: story.source === "uploaded" ? "edited" : story.source,
    });
  }

  return (
    <div className="space-y-5">
      <Field
        label="Title"
        htmlFor={`${id}-title`}
        hint="Name the piece of work."
        error={story.title.trim() ? null : "A title is required."}
      >
        <Input
          id={`${id}-title`}
          value={story.title}
          maxLength={CAREER_ARC_LIMITS.title}
          onChange={(event) => change({ title: event.target.value })}
        />
      </Field>

      {STORY_PARTS.map(({ key, label, hint }) => (
        <Field key={key} label={label} hint={hint} htmlFor={`${id}-${key}`}>
          <Textarea
            id={`${id}-${key}`}
            className="min-h-20"
            value={story[key] ?? ""}
            maxLength={CAREER_ARC_LIMITS.longField}
            onChange={(event) => change({ [key]: event.target.value || null })}
          />
        </Field>
      ))}

      <Field label="Notes" htmlFor={`${id}-notes`} hint="Anything else worth keeping.">
        <Textarea
          id={`${id}-notes`}
          className="min-h-20"
          value={story.notes ?? ""}
          maxLength={CAREER_ARC_LIMITS.longField}
          onChange={(event) => change({ notes: event.target.value || null })}
        />
      </Field>

      <Field label="Skills" hint="Press Enter after each one.">
        <TagInput
          value={story.skills ?? []}
          onChange={(skills) => change({ skills: skills.slice(0, CAREER_ARC_LIMITS.storySkills) })}
          placeholder="Postgres, queues"
        />
      </Field>

      <Field label="Links" hint="A design doc, a repo, a write-up.">
        <TagInput
          value={story.links ?? []}
          onChange={(links) => change({ links: links.slice(0, CAREER_ARC_LIMITS.links) })}
          placeholder="https://"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-3">
          <Switch
            checked={story.use_in_outreach ?? true}
            label="Use in outreach"
            onChange={(next) => change({ use_in_outreach: next })}
          />
          <span className="text-sm text-ink">Use in outreach emails</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={story.featured ?? false}
            label="Feature this story"
            onChange={(next) => change({ featured: next })}
          />
          <span className="text-sm text-ink">One of my best stories</span>
        </div>
      </div>
    </div>
  );
}
