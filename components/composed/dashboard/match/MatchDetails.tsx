"use client";

import { useId, useState } from "react";

import type { MatchPart } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { MatchBadge } from "./MatchBadge";

/** The score, and on request every part that made it. */
export function MatchDetails({
  band,
  score,
  parts,
  matched = [],
  missing = [],
}: {
  band: string;
  score: number;
  parts: MatchPart[];
  matched?: string[];
  missing?: string[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <MatchBadge band={band} score={score} />
        <Button
          variant="ghost"
          size="xs"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((shown) => !shown)}
        >
          {open ? "Hide details" : "Why this score"}
        </Button>
      </div>
      {open ? (
        <div id={id} className="flex flex-col gap-3 rounded-nest bg-surface-raised p-3">
          <dl className="grid gap-2">
            {parts.map((part) => (
              <div key={part.name} className="grid gap-0.5 sm:grid-cols-3 sm:gap-3">
                <dt className="utility-label text-ink-faint">{part.name}</dt>
                <dd
                  className={`text-xs sm:col-span-2 ${
                    part.value === null && part.name !== "Your ratings"
                      ? "text-ink-faint"
                      : "text-ink"
                  }`}
                >
                  {part.detail}
                </dd>
              </div>
            ))}
          </dl>
          {matched.length > 0 || missing.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matched.map((skill) => (
                <Badge key={`have-${skill}`} tone="success">
                  {skill}
                </Badge>
              ))}
              {missing.map((skill) => (
                <Badge key={`missing-${skill}`}>Missing: {skill}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
