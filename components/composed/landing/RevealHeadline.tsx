"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

export interface HeadlineLine {
  text: string;
  muted?: boolean;
}

const WORD_STAGGER = 0.05;

/** A display heading whose words rise into place, once, on mount or when it
 * scrolls into view. Each line can be muted for the soft second half. */
export function RevealHeadline({
  as: Tag = "h2",
  lines,
  trigger = "inView",
  delay = 0,
  className = "",
}: {
  as?: "h1" | "h2";
  lines: readonly HeadlineLine[];
  trigger?: "mount" | "inView";
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useLandingMotion();
  const words = lines.flatMap((line, lineIndex) =>
    line.text.split(" ").map((word, i) => ({ word, line, lineIndex, first: i === 0 })),
  );
  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown" };

  return (
    <Tag
      className={`text-balance font-display font-sans-semibold leading-display tracking-display ${className}`}
    >
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <motion.span
        aria-hidden
        className="block"
        initial={reduceMotion ? false : "hidden"}
        viewport={LANDING_VIEWPORT}
        transition={{ staggerChildren: WORD_STAGGER, delayChildren: delay }}
        {...play}
      >
        {words.map(({ word, line, lineIndex, first }, i) => (
          <span key={i}>
            {first && lineIndex > 0 ? <br /> : i > 0 ? " " : null}
            <span className="-mb-2 inline-block overflow-hidden pb-2 align-top">
              <motion.span
                className={`inline-block ${line.muted ? "text-ink-muted" : ""}`}
                variants={{ hidden: { y: "110%", opacity: 0 }, shown: { y: "0%", opacity: 1 } }}
                transition={{ duration: 0.9, ease: LANDING_EASE }}
              >
                {word}
              </motion.span>
            </span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
