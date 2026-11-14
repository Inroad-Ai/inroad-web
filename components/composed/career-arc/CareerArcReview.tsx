"use client";

import { useState } from "react";

import { Notice } from "@/components/ui/Notice";
import type { CareerArcDocument, CareerArcWarning } from "@/lib/api-client/client";
import { describeWarning, pruneEvidence } from "@/lib/career-arc";

import { BigPictureEditor } from "./BigPictureEditor";
import { ExperienceTab } from "./ExperienceTab";
import { StrengthsTab } from "./StrengthsTab";

type TabId = "experience" | "strengths" | "big-picture";

/** Three tabs: every chapter in one list, strengths backed by stories, and the
 * parts that belong to the whole arc. */
export function CareerArcReview({
  document,
  warnings = [],
  onChange,
}: {
  document: CareerArcDocument;
  warnings?: readonly CareerArcWarning[];
  onChange: (next: CareerArcDocument) => void;
}) {
  const [tab, setTab] = useState<TabId>("experience");
  const general = warnings.filter((warning) => !warning.item_id);
  const suggested = (document.strengths ?? []).filter((item) => item.source === "suggested").length;
  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: "experience", label: "Experience" },
    {
      id: "strengths",
      label: "Strengths",
      badge: suggested > 0 ? `${suggested} to review` : undefined,
    },
    { id: "big-picture", label: "Big picture" },
  ];

  // A story that was just removed must leave every strength's proof.
  const change = (next: CareerArcDocument) => onChange(pruneEvidence(next));

  return (
    <div className="space-y-4">
      {general.map((warning) => (
        <Notice key={`${warning.reason}-${warning.field}-${warning.value}`} tone="neutral" boxed>
          {describeWarning(warning)}
        </Notice>
      ))}

      <div role="tablist" aria-label="Career arc sections" className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-sans-semibold transition-colors duration-fast ${
              tab === item.id
                ? "bg-signal-amber text-on-amber"
                : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
            }`}
          >
            {item.label}
            {item.badge ? <span className="ml-2 text-xs opacity-80">{item.badge}</span> : null}
          </button>
        ))}
      </div>

      {tab === "experience" ? (
        <ExperienceTab document={document} warnings={warnings} onChange={change} />
      ) : null}
      {tab === "strengths" ? <StrengthsTab document={document} onChange={change} /> : null}
      {tab === "big-picture" ? <BigPictureEditor document={document} onChange={change} /> : null}
    </div>
  );
}
