"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLandingMotion } from "@/lib/landing-motion";

import { LandingSection } from "./LandingSection";

const PARAGRAPH =
  "Job boards put you in a queue for a vacancy. Inroad starts with companies that fit you, reads what they just announced, and helps you write to the one person who can say yes, whether or not a role is posted.";
const WORDS = PARAGRAPH.split(" ");
const DIM = 0.14;

function Word({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [index / WORDS.length, (index + 1) / WORDS.length],
    [DIM, 1],
  );
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** "Why this works": the paragraph lights up word by word as it scrolls past. */
export function ScrubParagraph() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useLandingMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.78", "end 0.42"] });

  return (
    <LandingSection className="md:py-36">
      <Eyebrow className="mb-6">Why this works</Eyebrow>
      <p
        ref={ref}
        className="max-w-4xl font-display text-3xl font-sans-medium leading-tight tracking-display text-ink md:text-4xl"
      >
        {reduceMotion
          ? PARAGRAPH
          : WORDS.map((word, i) => (
              <Word key={i} word={word} index={i} progress={scrollYProgress} />
            ))}
      </p>
    </LandingSection>
  );
}
