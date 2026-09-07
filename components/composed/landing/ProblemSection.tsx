"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const MANUAL_STEPS = ["Search for a fit", "Open too many tabs", "Try to find a reason", "Write from memory", "Hope it lands"] as const;

export function ProblemSection() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.58, ease: LANDING_EASE }}
          >
            <p className="utility-label text-muted-rose">The old loop</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
              It should not take an afternoon to send one good message.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
              Most job-search tools optimize the application. The hard part happens before that: deciding where your effort is actually worth spending.
            </p>
          </motion.div>

          <motion.div
            className="overflow-hidden rounded-lg border border-line bg-surface"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.12, ease: LANDING_EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <p className="utility-label text-text-secondary">Manual research</p>
              <span className="text-xs text-muted-rose">Context gets lost</span>
            </div>
            <ol className="divide-y divide-line">
              {MANUAL_STEPS.map((step, index) => (
                <motion.li
                  key={step}
                  className="flex items-center gap-4 px-5 py-4 sm:px-6"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={LANDING_VIEWPORT}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.38, delay: 0.18 + index * 0.07, ease: LANDING_EASE }}
                >
                  <span className="font-mono text-xs text-text-secondary/60">0{index + 1}</span>
                  <span className="text-sm text-text-secondary">{step}</span>
                  {index < MANUAL_STEPS.length - 1 ? <span aria-hidden className="ml-auto text-muted-rose/55">×</span> : <span aria-hidden className="ml-auto text-muted-rose">?</span>}
                </motion.li>
              ))}
            </ol>
            <div className="border-t border-signal-amber/30 bg-signal-amber-subtle/50 px-5 py-4 sm:px-6">
              <p className="text-sm font-medium text-ink">Inroad keeps the evidence together, before you decide to write.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
