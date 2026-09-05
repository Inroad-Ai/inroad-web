"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const STEPS = [
  {
    heading: "Find companies that actually fit what you want.",
    detail:
      "Tell Inroad what you're looking for and it surfaces companies worth pursuing, not a generic list of everyone hiring.",
  },
  {
    heading: "Research the details worth mentioning, fast.",
    detail:
      "Funding, team, tech stack, recent news, the specific thing that shows you did the homework, pulled together in minutes instead of an afternoon.",
  },
  {
    heading: "Send outreach that sounds like you, not a template.",
    detail:
      "Draft a message built on the research, not a mail-merge. You read it, edit it, and send it, nothing goes out without you.",
  },
] as const;

export function HowItWorks() {
  const reduceMotion = useLandingMotion();

  return (
    <section id="how-it-works" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.h2
          className="font-editorial text-2xl tracking-tight text-ink sm:text-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
        >
          How it works
        </motion.h2>

        <ol className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.heading}
              className="relative"
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.56, delay: 0.12 + index * 0.14, ease: LANDING_EASE }}
            >
              {index < STEPS.length - 1 ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-3 hidden h-px w-full origin-left translate-x-[calc(100%+1rem)] bg-signal-teal/35 sm:block"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={LANDING_VIEWPORT}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.34 + index * 0.14, ease: LANDING_EASE }}
                />
              ) : null}
              <motion.span
                className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-signal-teal-subtle px-2 utility-label text-signal-teal"
                whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <h3 className="mt-3 font-display text-lg leading-snug text-ink sm:text-xl">
                {step.heading}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary sm:text-base">
                {step.detail}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
