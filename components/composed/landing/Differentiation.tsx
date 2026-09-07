"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const COMPARISON = [
  ["Starting point", "A vacancy", "A company worth knowing"],
  ["What you receive", "A place in a queue", "Context for a real message"],
  ["How it feels", "Apply, then wait", "Research, decide, reach out"],
  ["Who sends", "A system on your behalf", "You, with the final word"],
] as const;

export function Differentiation() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: LANDING_EASE }}
        >
          <p className="utility-label text-signal-teal">A different lane</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            Not another way to apply faster.
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 overflow-hidden rounded-lg border border-line"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.1, ease: LANDING_EASE }}
        >
          <div className="grid grid-cols-[minmax(7rem,0.75fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] border-b border-line bg-paper text-sm sm:grid-cols-[minmax(11rem,0.85fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]">
            <div className="p-4 sm:p-5" />
            <div className="border-l border-line p-4 font-display font-semibold text-text-secondary sm:p-5">Job board</div>
            <div className="border-l border-line bg-signal-teal-subtle/45 p-4 font-display font-semibold text-signal-teal sm:p-5">Inroad</div>
          </div>
          {COMPARISON.map(([label, board, inroad], index) => (
            <motion.div
              key={label}
              className="grid grid-cols-[minmax(7rem,0.75fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] border-b border-line last:border-b-0 sm:grid-cols-[minmax(11rem,0.85fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.16 + index * 0.08, ease: LANDING_EASE }}
            >
              <div className="p-4 text-xs font-medium uppercase tracking-[0.08em] text-text-secondary sm:p-5 sm:text-sm sm:normal-case sm:tracking-normal">{label}</div>
              <div className="border-l border-line p-4 text-xs leading-relaxed text-text-secondary sm:p-5 sm:text-sm">{board}</div>
              <div className="border-l border-line bg-signal-teal-subtle/25 p-4 text-xs font-medium leading-relaxed text-ink sm:p-5 sm:text-sm">{inroad}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
