"use client";

import { useId } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";
import { Textarea } from "@/components/ui/Textarea";
import type { CareerArcDocument, CareerArcStrength } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS } from "@/lib/career-arc";

import { EvidencePicker } from "./EvidencePicker";

export function StrengthRow({
  document,
  strength,
  onChange,
  onRemove,
}: {
  document: CareerArcDocument;
  strength: CareerArcStrength;
  onChange: (next: CareerArcStrength) => void;
  onRemove: () => void;
}) {
  const id = useId();
  const suggested = strength.source === "suggested";
  const proof = (strength.evidence ?? []).length;

  return (
    <Card variant="nested" padding="md" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="min-w-0 flex-1 text-sm font-sans-semibold text-ink">
          {strength.skill.trim() || "New strength"}
        </span>
        {suggested ? <Badge tone="amber">Suggested</Badge> : null}
        <Badge tone={proof > 0 ? "success" : "warning"}>
          {proof === 0 ? "No proof yet" : `${proof} ${proof === 1 ? "story" : "stories"} as proof`}
        </Badge>
        <Button type="button" variant="ghost" size="xs" onClick={onRemove}>
          {suggested ? "Dismiss" : "Remove"}
        </Button>
      </div>

      {suggested ? (
        <Notice tone="neutral" boxed>
          We suggested this from your stories. It is not used in your emails until you keep it.
          <Button
            type="button"
            size="xs"
            className="ml-3"
            onClick={() => onChange({ ...strength, source: "accepted" })}
          >
            Keep it
          </Button>
        </Notice>
      ) : null}

      <Field label="Strength" htmlFor={`${id}-skill`}>
        <Input
          id={`${id}-skill`}
          value={strength.skill}
          maxLength={CAREER_ARC_LIMITS.strengthSkill}
          onChange={(event) => onChange({ ...strength, skill: event.target.value })}
        />
      </Field>
      <Field
        label="How it shows up"
        htmlFor={`${id}-how`}
        hint="One or two sentences, in your words."
      >
        <Textarea
          id={`${id}-how`}
          className="min-h-20"
          value={strength.how_it_shows ?? ""}
          maxLength={CAREER_ARC_LIMITS.howItShows}
          onChange={(event) => onChange({ ...strength, how_it_shows: event.target.value || null })}
        />
      </Field>
      <Field label="Proof" hint="Stories from any chapter that show it.">
        <EvidencePicker document={document} strength={strength} onChange={onChange} />
      </Field>
    </Card>
  );
}
