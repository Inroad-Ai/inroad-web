"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { CareerArcDocument } from "@/lib/api-client/client";
import { kindLabel, roleLabel, storyCount } from "@/lib/career-arc";
import { plural } from "@/lib/format";

const SHOWN_CHAPTERS = 5;

/** The calm view of a read career arc: what we found, in four lines of numbers
 * and a short list. Editing happens in the side panel, not here. */
export function CareerArcSummary({ document }: { document: CareerArcDocument }) {
  const roles = document.roles ?? [];
  const figures = [
    { value: roles.length, label: roles.length === 1 ? "chapter" : "chapters" },
    { value: storyCount(document), label: storyCount(document) === 1 ? "story" : "stories" },
    {
      value: document.strengths?.length ?? 0,
      label: (document.strengths?.length ?? 0) === 1 ? "strength" : "strengths",
    },
  ];
  const hidden = roles.length - SHOWN_CHAPTERS;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {figures.map((figure) => (
          <Card key={figure.label} variant="nested" className="text-center">
            <span className="block font-display text-title font-sans-semibold text-ink">
              {figure.value}
            </span>
            <span className="utility-label text-ink-muted">{figure.label}</span>
          </Card>
        ))}
      </div>

      <ul className="divide-y divide-ink/10 rounded-card border border-ink/10">
        {roles.slice(0, SHOWN_CHAPTERS).map((role) => {
          const dates = [role.start_date, role.end_date || (role.is_current ? "now" : null)]
            .filter(Boolean)
            .join(" to ");
          return (
            <li key={role.id} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-sans-semibold text-ink">
                  {roleLabel(role)}
                </span>
                {dates ? (
                  <span className="block truncate text-xs text-ink-muted">{dates}</span>
                ) : null}
              </span>
              {role.kind && role.kind !== "job" ? <Badge>{kindLabel(role.kind)}</Badge> : null}
              <span className="shrink-0 text-xs text-ink-muted">
                {plural(role.stories?.length ?? 0, "story", "stories")}
              </span>
            </li>
          );
        })}
        {hidden > 0 ? (
          <li className="px-4 py-3 text-xs text-ink-muted">
            and {plural(hidden, "more chapter", "more chapters")}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
