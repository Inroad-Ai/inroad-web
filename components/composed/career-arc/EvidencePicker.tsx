"use client";

import { Select } from "@/components/ui/Select";
import type { CareerArcDocument, CareerArcStrength } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, storyOptions } from "@/lib/career-arc";

export function EvidencePicker({
  document,
  strength,
  onChange,
}: {
  document: CareerArcDocument;
  strength: CareerArcStrength;
  onChange: (next: CareerArcStrength) => void;
}) {
  const options = storyOptions(document);
  const evidence = strength.evidence ?? [];
  const label = (id: string) => options.find((option) => option.id === id)?.label ?? "A story";
  const available = options.filter((option) => !evidence.includes(option.id));
  const full = evidence.length >= CAREER_ARC_LIMITS.evidence;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {evidence.map((id) => (
          <span
            key={id}
            className="inline-flex items-center gap-1 rounded-full bg-signal-teal-subtle py-1 pl-3 pr-1 text-xs text-signal-teal"
          >
            {label(id)}
            <button
              type="button"
              aria-label={`Remove ${label(id)} as evidence`}
              onClick={() =>
                onChange({ ...strength, evidence: evidence.filter((item) => item !== id) })
              }
              className="rounded-full px-1.5 py-0.5 hover:bg-ink/10"
            >
              ×
            </button>
          </span>
        ))}
        {evidence.length === 0 ? (
          <span className="text-xs text-ink-muted">No proof yet. Pick a story below.</span>
        ) : null}
      </div>
      {full ? (
        <p className="text-xs text-ink-muted">
          That is the most evidence a strength can hold ({CAREER_ARC_LIMITS.evidence}).
        </p>
      ) : (
        <Select
          aria-label="Add a story as evidence"
          className="w-full"
          value=""
          disabled={available.length === 0}
          onChange={(event) => {
            if (event.target.value) {
              onChange({ ...strength, evidence: [...evidence, event.target.value] });
            }
          }}
        >
          <option value="">
            {available.length === 0 ? "No more stories to add" : "Add a story as evidence"}
          </option>
          {available.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
