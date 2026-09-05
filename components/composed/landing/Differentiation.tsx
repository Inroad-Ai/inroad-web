"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

export function Differentiation() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.h2
          className="font-editorial text-2xl tracking-tight text-ink sm:text-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
        >
          Why not just use a job board?
        </motion.h2>

        <div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          <motion.article
            className="rounded-md border border-line bg-surface-raised p-6"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.1, ease: LANDING_EASE }}
          >
            <p className="utility-label text-text-secondary">Job board</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-secondary">
              Job boards get you into a queue behind a thousand other applicants
              and an ATS filter.
            </p>
          </motion.article>
          <motion.article
            className="rounded-md border border-signal-teal/30 bg-surface p-6 shadow-card"
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.22, ease: LANDING_EASE }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <p className="utility-label text-signal-teal">Inroad</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-text-secondary">
              Inroad skips the queue and gets you a message in front of a person,
              backed by research on their company that proves you didn&apos;t mass-apply.
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
