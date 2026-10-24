"use client";

import { useMotionValue } from "framer-motion";

import { NodeField } from "@/components/ui/NodeField";
import { SECTION_IDS } from "@/lib/landing/sections";
import { FIT_COUNT, STORY_CHAPTERS } from "@/lib/landing/story-chapters";

import { StoryCtas } from "./ChapterExtras";
import { ChapterText } from "./ChapterText";
import { DossierCard } from "./DossierCard";
import { FitCounter } from "./FitCounter";
import { MAIL_WORD_COUNT, MailCard } from "./MailCard";
import { PersonCard } from "./PersonCard";
import { SentVisual, YouTag } from "./StoryMarks";

const FIT_NODES = Array.from({ length: FIT_COUNT }, (_, i) => ({
  label: i === 0 ? "Ledgerline" : "",
}));

function Visual({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <YouTag state="active" still withDot />;
    case 1:
      return (
        <div className="relative h-80 w-full overflow-hidden rounded-card">
          <NodeField mode="story" progress={1} nodes={FIT_NODES} />
        </div>
      );
    case 2:
      return <DossierCard state="active" still />;
    case 3:
      return <PersonCard state="active" still />;
    case 4:
      return <MailCard state="active" still shownWords={MAIL_WORD_COUNT} />;
    default:
      return <SentVisual state="active" still />;
  }
}

/** The story for visitors who asked for reduced motion: every chapter laid out
 * in order, settled, nothing pinned or scrubbed. */
export function StaticStory() {
  const settled = useMotionValue(1);
  return (
    <section
      id={SECTION_IDS.story}
      aria-label="The story of one email"
      className="relative isolate"
    >
      <div aria-hidden className="absolute -right-1/4 top-0 -z-10 h-full w-3/4 bg-glow-teal" />
      {STORY_CHAPTERS.map((chapter, i) => (
        <div
          key={chapter.id}
          className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:py-24"
        >
          <ChapterText chapter={chapter} number={i + 1} state="active" still>
            {i === 1 ? <FitCounter fieldProgress={settled} /> : null}
            {i === 5 ? <StoryCtas /> : null}
          </ChapterText>
          <div className="grid place-items-center">
            <Visual index={i} />
          </div>
        </div>
      ))}
    </section>
  );
}
