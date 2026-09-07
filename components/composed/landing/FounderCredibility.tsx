"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

export function FounderCredibility() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="border-b border-line bg-signal-teal-subtle/35">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          className="grid gap-10 rounded-lg border border-signal-teal/20 bg-surface p-7 shadow-card sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.66, ease: LANDING_EASE }}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-signal-teal text-2xl font-semibold text-paper">I</div>
          <div>
            <p className="utility-label text-signal-teal">Why this exists</p>
            <blockquote className="mt-4 max-w-3xl font-display text-2xl font-medium leading-snug tracking-[-0.035em] text-ink sm:text-3xl">
              “I was already doing the research by hand. The part worth building was a way not to lose it before I wrote the message.”
            </blockquote>
            <div className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <p className="text-sm leading-relaxed text-text-secondary">
                Inroad is early, and there is no customer roster to hide behind. It grew out of a founder&apos;s own job search—one browser tab at a time—and is being built for people who want to do careful work without repeating it.
              </p>
              <p className="text-sm font-medium text-ink sm:border-l sm:border-line sm:pl-5">
                Early access means honest limits, direct feedback, and a product that still keeps you in control.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
