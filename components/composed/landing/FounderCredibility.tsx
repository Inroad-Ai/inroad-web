"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

export function FounderCredibility() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          className="max-w-3xl border-l-2 border-signal-teal pl-6 sm:pl-8"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.66, ease: LANDING_EASE }}
        >
          <p className="utility-label text-signal-teal">Who built this</p>

          <h2 className="mt-4 max-w-2xl font-editorial text-2xl tracking-tight text-ink sm:text-3xl">
            Built by someone who did this by hand first.
          </h2>

          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-text-secondary sm:text-lg">
            No customer roster to point to yet, Inroad is new. What it&apos;s
            built on is a founder&apos;s own job search: researching companies
            by hand, one browser tab at a time, before deciding the process
            itself was the thing worth building. If you&apos;re early enough to
            use this before anyone else has, that&apos;s the honest version of
            where things stand.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
