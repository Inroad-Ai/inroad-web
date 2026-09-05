"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

export function ProblemSection() {
  const reduceMotion = useLandingMotion();

  return (
    <section className="overflow-hidden border-t border-line bg-surface-raised/35">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: LANDING_EASE }}
          >
            <p className="utility-label text-muted-rose">The problem</p>
            <h2 className="mt-4 font-editorial text-2xl tracking-tight text-ink sm:text-3xl">
              The application black hole
            </h2>
          </motion.div>

          <div className="space-y-4 font-sans text-base leading-relaxed text-text-secondary sm:text-lg">
            <motion.p
              className="rounded-md border border-line bg-surface p-6 shadow-card"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.12, ease: LANDING_EASE }}
            >
              You spend an hour finding a company that actually fits, another
              hour digging through their About page and news for something
              worth mentioning, then send a message that still sounds like
              everyone else&apos;s. Then nothing. Not a rejection, not a reply,
              just silence, and no way to tell if the message even got read.
            </motion.p>
            <motion.p
              className="border-l-2 border-signal-amber pl-6"
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.24, ease: LANDING_EASE }}
            >
              I built Inroad because I was doing exactly that by hand, for my
              own job search, and got tired of watching the research
              disappear into a message I&apos;d never reuse.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
