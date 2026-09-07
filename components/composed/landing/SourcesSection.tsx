"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const SOURCES = [
  {
    number: "01",
    name: "Homepage",
    copy: "Capture how the company describes itself, in its own words.",
    note: "Positioning, product language, team context",
    className: "md:col-span-7",
    tone: "bg-signal-teal-subtle text-signal-teal",
  },
  {
    number: "02",
    name: "News",
    copy: "Spot the recent moment that gives your outreach a real reason to exist.",
    note: "Funding, launches, shifts and momentum",
    className: "md:col-span-5",
    tone: "bg-signal-amber-subtle text-warning",
  },
  {
    number: "03",
    name: "Hiring signal",
    copy: "See where a company is investing its attention right now.",
    note: "Open roles, careers source, teams in motion",
    className: "md:col-span-12",
    tone: "bg-success-subtle text-success",
  },
] as const;

export function SourcesSection() {
  const reduceMotion = useLandingMotion();

  return (
    <section id="sources" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <motion.div
            className="md:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
          >
            <p className="utility-label text-signal-teal">A useful research brief</p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
              Three signals. One clear starting point.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-md text-sm leading-relaxed text-text-secondary md:col-span-5 md:justify-self-end sm:text-base"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={LANDING_VIEWPORT}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.56, delay: 0.12, ease: LANDING_EASE }}
          >
            The value is not another company database. It is having enough
            current, specific context to decide whether a conversation is worth starting.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-12">
          {SOURCES.map((source, index) => (
            <motion.article
              key={source.name}
              className={`${source.className} group relative min-h-64 overflow-hidden rounded-lg border border-line bg-paper p-6 sm:p-8`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: index * 0.1, ease: LANDING_EASE }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <span className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-display text-sm font-semibold ${source.tone}`}>
                {source.number}
              </span>
              <div className="relative mt-10 max-w-sm">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{source.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-text-secondary">{source.copy}</p>
              </div>
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 border-t border-line pt-4 sm:inset-x-8 sm:bottom-8">
                <span className="text-xs text-text-secondary">{source.note}</span>
                <motion.span aria-hidden className="text-lg text-ink" whileHover={{ x: 3 }}>↗</motion.span>
              </div>
              <div aria-hidden className={`absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-60 ${source.tone.split(" ")[0]}`} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
