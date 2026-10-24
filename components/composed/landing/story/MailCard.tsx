"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { STORY_MAIL } from "@/lib/landing/story-chapters";

import { CARD_VARIANTS, type ChapterState } from "./story-motion";

const PARAGRAPHS = STORY_MAIL.paragraphs.map((segments) =>
  segments.flatMap((segment) =>
    segment.text.split(" ").map((word) => ({ word, mark: segment.mark ?? false })),
  ),
);
export const MAIL_WORD_COUNT = PARAGRAPHS.flat().length;

/** Chapter five: the draft, writing itself as the visitor scrolls. `shownWords`
 * reveals that many words; the rest keep their space so nothing reflows. */
export function MailCard({
  state,
  shownWords,
  still = false,
}: {
  state: ChapterState;
  shownWords: number;
  still?: boolean;
}) {
  let index = 0;
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      className="w-full max-w-lg overflow-hidden rounded-card bg-surface shadow-pop"
    >
      <dl className="border-b border-line px-4 py-0.5 md:px-5 md:py-1.5">
        {[
          ["To", STORY_MAIL.to],
          ["Subject", STORY_MAIL.subject],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex gap-3 border-b border-line py-2 text-xs last:border-b-0 md:py-2.5 md:text-sm"
          >
            <dt className="w-14 shrink-0 text-ink-muted">{label}</dt>
            <dd className="font-sans-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-2 px-4 py-3 text-xs text-ink-muted md:space-y-3 md:px-5 md:py-4 md:text-sm">
        {PARAGRAPHS.map((words, p) => (
          <p key={p}>
            {words.map(({ word, mark }, i) => {
              const visible = index++ < shownWords;
              return (
                <span key={i}>
                  {i > 0 ? " " : null}
                  <span
                    className={`transition-opacity duration-fast ${visible ? "opacity-100" : "opacity-0"} ${
                      mark ? "rounded-sm bg-signal-amber-subtle px-0.5 text-ink" : ""
                    }`}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2.5 border-t border-line px-4 py-3 text-xs font-sans-semibold text-ink-muted md:px-5">
        <span>3 facts used · all sourced</span>
        <Button href="/signup" size="sm" className="ml-auto">
          Send
        </Button>
      </div>
    </motion.div>
  );
}
