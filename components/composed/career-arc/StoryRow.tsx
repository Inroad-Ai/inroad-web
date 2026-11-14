"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import type { CareerArcStory, CareerArcWarning } from "@/lib/api-client/client";
import { STORY_PARTS, describeWarning, filledParts } from "@/lib/career-arc";

import { StoryEditor } from "./StoryEditor";

export function StoryRow({
  story,
  warnings,
  privateByDefault,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  story: CareerArcStory;
  warnings: CareerArcWarning[];
  privateByDefault: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (next: CareerArcStory) => void;
  onRemove: () => void;
}) {
  const filled = filledParts(story);

  return (
    <Card variant="nested" padding="none" className="bg-surface">
      <div className="flex items-center gap-2 pr-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1 truncate text-sm font-sans-semibold text-ink">
            {story.title.trim() || "Untitled story"}
          </span>
          {story.featured ? <Badge tone="amber">Featured</Badge> : null}
          {story.use_in_outreach ? null : (
            <Badge tone={privateByDefault ? "warning" : "neutral"}>
              {privateByDefault ? "Private" : "Hidden from outreach"}
            </Badge>
          )}
          {warnings.length > 0 ? <Badge tone="warning">Check {warnings.length}</Badge> : null}
          <Badge tone={filled >= 5 ? "success" : "neutral"}>
            {filled} of {STORY_PARTS.length} parts
          </Badge>
          <ChevronDownIcon open={open} />
        </button>
        <Button type="button" variant="ghost" size="xs" onClick={onRemove}>
          Remove
        </Button>
      </div>

      {open ? (
        <div className="space-y-5 px-4 pb-5">
          {privateByDefault ? (
            <Notice tone="neutral" boxed>
              Stories here stay out of your outreach emails unless you turn &ldquo;Use in outreach
              emails&rdquo; on below.
            </Notice>
          ) : null}
          {warnings.map((warning) => (
            <Notice
              key={`${warning.reason}-${warning.field}-${warning.value}`}
              tone="neutral"
              boxed
            >
              {describeWarning(warning)}
            </Notice>
          ))}
          <StoryEditor story={story} onChange={onChange} />
        </div>
      ) : null}
    </Card>
  );
}
