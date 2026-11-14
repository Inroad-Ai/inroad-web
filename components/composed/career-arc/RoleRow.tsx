"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronDownIcon, PlusIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import type { CareerArcRole, CareerArcStory, CareerArcWarning } from "@/lib/api-client/client";
import {
  CAREER_ARC_LIMITS,
  PROJECT_STATUSES,
  describeWarning,
  isPrivateByDefault,
  kindLabel,
  matchesSearch,
  newStory,
  roleLabel,
  warningsFor,
} from "@/lib/career-arc";
import { plural } from "@/lib/format";

import { RoleEditor } from "./RoleEditor";
import { StoryRow } from "./StoryRow";

export function RoleRow({
  role,
  warnings,
  query,
  isOpen,
  onToggle,
  onChange,
  onRemove,
}: {
  role: CareerArcRole;
  warnings: readonly CareerArcWarning[];
  query: string;
  isOpen: (id: string) => boolean;
  onToggle: (id: string, open?: boolean) => void;
  onChange: (next: CareerArcRole) => void;
  onRemove: () => void;
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const stories = role.stories ?? [];
  const searching = query.trim().length > 0;
  const open = isOpen(role.id) || searching;
  const shown = stories.filter((story) => matchesSearch(role, story, query));
  const own = warningsFor(warnings, role.id);
  const checks =
    own.length +
    stories.reduce((total, story) => total + warningsFor(warnings, story.id).length, 0);
  const privateKind = isPrivateByDefault(role.kind);
  const status = PROJECT_STATUSES.find((option) => option.value === role.status)?.label;
  const dates = [role.start_date, role.end_date || (role.is_current ? "now" : null)]
    .filter(Boolean)
    .join(" to ");

  function replaceStory(next: CareerArcStory) {
    onChange({
      ...role,
      stories: stories.map((story) => (story.id === next.id ? next : story)),
    });
  }

  function removeStory(id: string) {
    onChange({ ...role, stories: stories.filter((story) => story.id !== id) });
  }

  function addStory() {
    const created = newStory(role.kind);
    onChange({ ...role, stories: [...stories, created] });
    onToggle(role.id, true);
    onToggle(created.id, true);
  }

  return (
    <Card variant="nested" padding="none">
      <div className="flex items-center gap-2 pr-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => onToggle(role.id)}
          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-sans-semibold text-ink">
              {roleLabel(role)}
            </span>
            {dates ? <span className="block truncate text-xs text-ink-muted">{dates}</span> : null}
          </span>
          {role.kind && role.kind !== "job" ? <Badge>{kindLabel(role.kind)}</Badge> : null}
          {status ? <Badge tone="success">{status}</Badge> : null}
          {privateKind ? <Badge tone="warning">Private</Badge> : null}
          {checks > 0 ? <Badge tone="warning">Check {checks}</Badge> : null}
          <Badge tone="teal">{plural(stories.length, "story", "stories")}</Badge>
          <ChevronDownIcon open={open} />
        </button>
        <Button type="button" variant="ghost" size="xs" onClick={() => setConfirmingRemove(true)}>
          Remove
        </Button>
      </div>

      {confirmingRemove ? (
        <div className="space-y-3 px-4 pb-4">
          <Notice tone="neutral" boxed>
            Remove {roleLabel(role)}
            {stories.length > 0 ? ` and its ${plural(stories.length, "story", "stories")}` : ""}?
          </Notice>
          <div className="flex gap-3">
            <Button type="button" size="sm" onClick={onRemove}>
              Remove
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingRemove(false)}
            >
              Keep it
            </Button>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="space-y-4 px-4 pb-5">
          {own.map((warning) => (
            <Notice
              key={`${warning.reason}-${warning.field}-${warning.value}`}
              tone="neutral"
              boxed
            >
              {describeWarning(warning)}
            </Notice>
          ))}
          {searching ? null : <RoleEditor role={role} onChange={onChange} />}

          <div className="space-y-2">
            {shown.map((story) => (
              <StoryRow
                key={story.id}
                story={story}
                warnings={warningsFor(warnings, story.id)}
                privateByDefault={privateKind}
                open={isOpen(story.id)}
                onToggle={() => onToggle(story.id)}
                onChange={replaceStory}
                onRemove={() => removeStory(story.id)}
              />
            ))}
            {searching && shown.length === 0 ? (
              <p className="text-sm text-ink-muted">No stories here match.</p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<PlusIcon />}
            onClick={addStory}
            disabled={stories.length >= CAREER_ARC_LIMITS.storiesPerRole}
          >
            Add a story
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
