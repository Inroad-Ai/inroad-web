"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const REASONS = [
  { label: "Role match", score: 96 },
  { label: "Stack", score: 94 },
  { label: "Stage", score: 88 },
  { label: "Work style", score: 90 },
] as const;

/** A fit score broken into the four reasons behind it. */
export function FitMini() {
  const reduceMotion = useLandingMotion();
  return (
    <div className="grid gap-2.5">
      {REASONS.map(({ label, score }, i) => (
        <div
          key={label}
          className="grid grid-cols-meter items-center gap-3 text-sm font-sans-semibold text-ink"
        >
          <span>{label}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <motion.span
              className="block h-full origin-left rounded-full bg-signal-amber"
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: score / 100 }}
              animate={reduceMotion ? { scaleX: score / 100 } : undefined}
              viewport={LANDING_VIEWPORT}
              transition={{ duration: 1.4, ease: LANDING_EASE, delay: i * 0.12 }}
            />
          </span>
          <b className="text-right text-lg font-sans-semibold tracking-display">{score}</b>
        </div>
      ))}
    </div>
  );
}
