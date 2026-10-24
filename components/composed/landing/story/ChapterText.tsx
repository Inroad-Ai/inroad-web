"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import type { StoryChapter } from "@/lib/landing/story-chapters";

import { LINE_VARIANTS, WORD_VARIANTS, type ChapterState } from "./story-motion";

const WORD_STAGGER = 0.012;

/** Kicker, title and copy for one chapter. `still` renders it settled, with
 * no motion, for the stacked reduced-motion story. */
export function ChapterText({
  chapter,
  number,
  state,
  still = false,
  compact = false,
  children,
}: {
  chapter: StoryChapter;
  number: number;
  state: ChapterState;
  still?: boolean;
  /** Drop the copy on short phone screens, where the pinned stage has no room. */
  compact?: boolean;
  children?: ReactNode;
}) {
  const isYou = number === 1;
  return (
    <motion.div
      className="relative max-w-xl"
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      transition={{ staggerChildren: WORD_STAGGER }}
    >
      <motion.p
        variants={LINE_VARIANTS}
        className="utility-label mb-4 flex items-center gap-3 text-ink-muted after:h-px after:w-12 after:bg-ink/20 md:mb-6"
      >
        <span className="text-signal-amber">0{number}</span> {chapter.kicker}
      </motion.p>
      <h2
        className={`text-balance font-display font-sans-semibold tracking-display text-ink ${
          isYou ? "text-chapter-xl" : "text-chapter"
        }`}
      >
        <span className="sr-only">{chapter.title}</span>
        <span aria-hidden>
          {chapter.title.split(" ").map((word, i) => (
            <span key={i}>
              {i > 0 ? " " : null}
              <span className="-mb-2 inline-block overflow-hidden pb-2 align-top">
                <motion.span className="inline-block" variants={WORD_VARIANTS}>
                  {word}
                </motion.span>
              </span>
            </span>
          ))}
        </span>
      </h2>
      <motion.p
        variants={LINE_VARIANTS}
        className={`mt-3.5 max-w-md text-base text-ink-muted md:mt-6 md:text-lg ${
          compact ? "max-md:short:hidden" : ""
        }`}
      >
        {chapter.copy}
      </motion.p>
      {children ? <motion.div variants={LINE_VARIANTS}>{children}</motion.div> : null}
    </motion.div>
  );
}
