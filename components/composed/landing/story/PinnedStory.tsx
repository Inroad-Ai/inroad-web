"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import { ArrowDownIcon } from "@/components/ui/Icons";
import { SECTION_IDS } from "@/lib/landing/sections";
import { STORY_CHAPTERS, chapterAt, chapterEnd } from "@/lib/landing/story-chapters";

import { StoryCtas } from "./ChapterExtras";
import { ChapterText } from "./ChapterText";
import { DossierCard } from "./DossierCard";
import { FitCounter } from "./FitCounter";
import { MailChapter } from "./MailChapter";
import { PersonCard } from "./PersonCard";
import { SentVisual, YouTag } from "./StoryMarks";
import { StoryField } from "./StoryField";
import { StoryRail } from "./StoryRail";
import { chapterStateFor } from "./story-motion";
import { useIsNarrow } from "./useIsNarrow";

const WIDE_CENTER = { x: 0.72, y: 0.5 };
const NARROW_CENTER = { x: 0.5, y: 0.7 };
const [, MARKET, COMPANY, , , SENT] = STORY_CHAPTERS.map((c) => c.start);
// Gather and filter finish a little before chapter two ends, so the twelve
// fits hold still while its copy is read.
const FIELD_DONE = MARKET + (COMPANY - MARKET) * 0.85;
const SKIP_HIDES_AFTER = 0.96;
const JUMP_INTO_CHAPTER = 0.02;
// Hidden chapters leave the tab order and the accessibility tree, but only
// once their exit animation has played.
const HIDDEN_AFTER_EXIT = "invisible transition-visibility delay-500";

/** The story pinned under a tall scroll track: CSS sticky holds the stage,
 * useScroll turns the track into 0 to 1, and that picks the chapter, drives
 * the node field and types the email. */
export function PinnedStory() {
  const trackRef = useRef<HTMLElement>(null);
  const isNarrow = useIsNarrow();
  const center = isNarrow ? NARROW_CENTER : WIDE_CENTER;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [inStory, setInStory] = useState(false);
  const [skipVisible, setSkipVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(chapterAt(p));
    setInStory(p > 0 && p < 1);
    setSkipVisible(p < SKIP_HIDES_AFTER);
  });

  const fieldProgress = useTransform(scrollYProgress, [MARKET, FIELD_DONE], [0, 1], {
    clamp: true,
  });
  const fieldOpacity = useTransform(
    scrollYProgress,
    [COMPANY - 0.02, COMPANY + 0.03, SENT - 0.03, SENT],
    [1, 0.35, 0.35, 0],
  );
  const sunrise = useTransform(scrollYProgress, [SENT - 0.02, SENT + 0.05], [0, 1]);

  const jumpTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const travel = track.offsetHeight - window.innerHeight;
    const at = Math.min(STORY_CHAPTERS[index].start + JUMP_INTO_CHAPTER, chapterEnd(index));
    window.scrollTo({ top: top + at * travel, behavior: "smooth" });
  };

  return (
    <>
      <section
        id={SECTION_IDS.story}
        ref={trackRef}
        aria-label="The story of one email"
        className="relative h-story-track"
      >
        <div className="sticky top-0 isolate h-screen overflow-hidden">
          <motion.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-x-0 top-0 z-20 h-0.5 origin-left bg-gradient-to-r from-signal-teal to-signal-amber"
          />
          <div aria-hidden className="absolute -right-1/4 top-0 -z-10 h-full w-3/4 bg-glow-teal" />
          <motion.div
            aria-hidden
            style={{ opacity: sunrise }}
            className="absolute -bottom-1/2 left-1/2 -z-10 h-full w-bleed -translate-x-1/2 bg-glow-amber"
          />
          <StoryField progress={fieldProgress} opacity={fieldOpacity} center={center} />

          <div
            className="absolute -translate-x-1/2 translate-y-10"
            style={{ left: `${center.x * 100}%`, top: `${center.y * 100}%` }}
          >
            <YouTag state={chapterStateFor(0, active)} />
          </div>

          {STORY_CHAPTERS.map((chapter, i) => {
            const state = chapterStateFor(i, active);
            return (
              <div
                key={chapter.id}
                className={`absolute inset-0 z-10 grid grid-rows-story content-start gap-5 px-5 pb-16 pt-24 md:grid-cols-story md:grid-rows-1 md:content-center md:items-center md:gap-10 md:px-10 lg:pl-16 lg:pr-32 ${
                  state === "active" ? "visible" : HIDDEN_AFTER_EXIT
                }`}
              >
                <ChapterText chapter={chapter} number={i + 1} state={state} compact>
                  {i === 1 ? <FitCounter fieldProgress={fieldProgress} /> : null}
                  {i === 5 ? <StoryCtas /> : null}
                </ChapterText>
                <div className="relative grid min-h-0 place-items-center">
                  {i === 2 ? <DossierCard state={state} /> : null}
                  {i === 3 ? <PersonCard state={state} /> : null}
                  {i === 4 ? <MailChapter state={state} progress={scrollYProgress} /> : null}
                  {i === 5 ? <SentVisual state={state} /> : null}
                </div>
              </div>
            );
          })}

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 h-1/5 bg-gradient-to-b from-transparent to-paper"
          />
          <a
            href={`#${SECTION_IDS.afterStory}`}
            className={`absolute bottom-5 left-1/2 z-20 inline-flex h-9 -translate-x-1/2 items-center gap-2 rounded-full bg-surface px-4 text-xs font-sans-bold text-ink-muted shadow-card transition-opacity duration-base hover:text-ink ${
              skipVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            Skip the story
            <ArrowDownIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
      <StoryRail visible={inStory} active={active} onJump={jumpTo} />
    </>
  );
}
