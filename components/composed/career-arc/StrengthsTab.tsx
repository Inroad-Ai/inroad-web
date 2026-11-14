"use client";

import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";
import type { CareerArcDocument, CareerArcStrength } from "@/lib/api-client/client";
import {
  CAREER_ARC_LIMITS,
  STRENGTH_SUGGESTIONS,
  newStrength,
  storyOptions,
} from "@/lib/career-arc";

import { StrengthRow } from "./StrengthRow";

/** Soft skills, each backed by the stories that show it. */
export function StrengthsTab({
  document,
  onChange,
}: {
  document: CareerArcDocument;
  onChange: (next: CareerArcDocument) => void;
}) {
  const strengths = document.strengths ?? [];
  const taken = new Set(strengths.map((strength) => strength.skill.trim().toLowerCase()));
  const hasStories = storyOptions(document).length > 0;

  function replace(next: CareerArcStrength) {
    onChange({
      ...document,
      strengths: strengths.map((strength) => (strength.id === next.id ? next : strength)),
    });
  }

  function add(skill = "") {
    onChange({ ...document, strengths: [...strengths, newStrength(skill)] });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-muted">
        A strength on its own proves nothing. Each one points at the stories that show it, so your
        emails can say it and back it up.
      </p>

      {strengths.map((strength) => (
        <StrengthRow
          key={strength.id}
          document={document}
          strength={strength}
          onChange={replace}
          onRemove={() =>
            onChange({
              ...document,
              strengths: strengths.filter((existing) => existing.id !== strength.id),
            })
          }
        />
      ))}

      {strengths.length === 0 ? (
        <p className="rounded-nest bg-surface-raised px-4 py-4 text-sm text-ink-muted">
          {hasStories
            ? "Pick a strength below, then choose the stories that show it."
            : "Add some stories first, then come back to say what they show."}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {STRENGTH_SUGGESTIONS.filter((name) => !taken.has(name.toLowerCase())).map((name) => (
          <button
            key={name}
            type="button"
            disabled={strengths.length >= CAREER_ARC_LIMITS.strengths}
            onClick={() => add(name)}
            className="rounded-full bg-ink/5 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-fast hover:bg-ink/10 hover:text-ink disabled:opacity-50"
          >
            + {name}
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={<PlusIcon />}
        onClick={() => add()}
        disabled={strengths.length >= CAREER_ARC_LIMITS.strengths}
      >
        Add your own strength
      </Button>
    </div>
  );
}
