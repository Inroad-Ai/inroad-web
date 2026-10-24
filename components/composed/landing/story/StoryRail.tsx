"use client";

import { SECTION_IDS } from "@/lib/landing/sections";
import { STORY_CHAPTERS } from "@/lib/landing/story-chapters";

/** Fixed chapter index beside the pinned story, on large screens. */
export function StoryRail({
  visible,
  active,
  onJump,
}: {
  visible: boolean;
  active: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Story chapters"
      className={`group fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 py-3 transition-opacity duration-base lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {STORY_CHAPTERS.map((chapter, i) => {
        const isActive = i === active;
        return (
          <button
            key={chapter.id}
            type="button"
            aria-current={isActive ? "step" : undefined}
            onClick={() => onJump(i)}
            className={`utility-label flex h-8 items-center gap-2.5 rounded-full px-1.5 ${
              isActive ? "text-ink" : "text-ink-faint hover:text-ink"
            }`}
          >
            <span
              className={`whitespace-nowrap transition duration-fast group-hover:translate-x-0 group-hover:opacity-100 ${
                isActive ? "opacity-100" : "translate-x-1.5 opacity-0"
              }`}
            >
              {chapter.rail}
            </span>
            <span
              className={`grid h-7 w-7 place-items-center rounded-full border tabular-nums transition-colors duration-fast ${
                isActive
                  ? "border-signal-amber bg-signal-amber text-on-amber"
                  : i < active
                    ? "border-ink-muted text-ink-muted"
                    : "border-ink/20"
              }`}
            >
              {i + 1}
            </span>
          </button>
        );
      })}
      <a
        href={`#${SECTION_IDS.afterStory}`}
        className="mt-1.5 px-1.5 py-1.5 text-xs font-sans-bold text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        Skip the story
      </a>
    </nav>
  );
}
