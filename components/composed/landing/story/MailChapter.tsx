"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";

import { chapterProgress } from "@/lib/landing/story-chapters";

import { MAIL_WORD_COUNT, MailCard } from "./MailCard";
import type { ChapterState } from "./story-motion";

const EMAIL_CHAPTER = 4;
// Typing starts once the card has risen in and finishes with room to read.
const TYPE_FROM = 0.15;
const TYPE_TO = 0.8;

const wordsAt = (progress: number) => {
  const local = chapterProgress(progress, EMAIL_CHAPTER);
  const typed = Math.min(1, Math.max(0, (local - TYPE_FROM) / (TYPE_TO - TYPE_FROM)));
  return Math.round(typed * MAIL_WORD_COUNT);
};

/** Chapter five's email, typed by the scroll position. */
export function MailChapter({
  state,
  progress,
}: {
  state: ChapterState;
  progress: MotionValue<number>;
}) {
  const [shown, setShown] = useState(() => wordsAt(progress.get()));
  useMotionValueEvent(progress, "change", (p) => setShown(wordsAt(p)));
  return <MailCard state={state} shownWords={shown} />;
}
