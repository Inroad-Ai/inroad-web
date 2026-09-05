"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const SOURCES = [
  {
    code: "SOURCE_01",
    name: "Homepage",
    line: "How the company describes itself today, in its own words — so your first line quotes their positioning instead of guessing at it.",
  },
  {
    code: "SOURCE_02",
    name: "News",
    line: "Recent headlines about them, newest first — so you know about the funding round or the layoffs before you write, not after they reply.",
  },
  {
    code: "SOURCE_03",
    name: "Hiring signal",
    line: "Which roles they have open right now — the clearest public sign of where they are spending, and the easiest thing to reference honestly.",
  },
];

export function SourcesSection() {
  const reduceMotion = useLandingMotion();

  return (
    <section id="sources" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.p
          className="utility-label text-text-secondary"
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: LANDING_EASE }}
        >
          What each run gives you
        </motion.p>

        <div className="mt-10 grid gap-10 sm:mt-14 md:grid-cols-3 md:gap-8">
          {SOURCES.map((source, index) => (
            <motion.article
              key={source.code}
              className="group relative overflow-hidden rounded-md border border-line bg-surface p-6 shadow-card"
              initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: index === 1 ? 1 : 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: index * 0.1, ease: LANDING_EASE }}
              whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.22 } }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left bg-signal-amber"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={LANDING_VIEWPORT}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.16 + index * 0.1, ease: LANDING_EASE }}
              />
              <span className="utility-label text-signal-teal">
                {source.code}
              </span>
              <h3 className="mt-3 font-display text-xl text-ink">
                {source.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {source.line}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
