"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const STEPS = [
  {
    number: "01",
    title: "Start with a company you are curious about.",
    copy: "Drop in a domain. Inroad gives the research a single, reusable home instead of another loose tab.",
    evidence: "stripe.com",
  },
  {
    number: "02",
    title: "Let the useful context come together.",
    copy: "Homepage, recent news, and hiring signals are checked at the same time. You see what came back and where it came from.",
    evidence: "3 sources checked",
  },
  {
    number: "03",
    title: "Write from evidence, then make it yours.",
    copy: "Use the dossier to build a message worth sending. You edit it, decide on it, and send it yourself.",
    evidence: "Always your call",
  },
] as const;

export function HowItWorks() {
  const reduceMotion = useLandingMotion();

  return (
    <section id="how-it-works" className="overflow-hidden border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
        >
          <div>
            <p className="utility-label text-text-secondary">From curiosity to outreach</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
              A calmer way to do the homework.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary sm:text-right">
            The work stays human. Inroad just removes the part that makes each good lead feel expensive.
          </p>
        </motion.div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.number}
              className="relative flex min-h-80 flex-col rounded-lg border border-line bg-surface p-6 sm:p-7"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={LANDING_VIEWPORT}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: index * 0.12, ease: LANDING_EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="utility-label text-signal-teal">Step {step.number}</span>
                {index < STEPS.length - 1 ? <span aria-hidden className="hidden text-signal-amber md:block">→</span> : null}
              </div>
              <h3 className="mt-12 max-w-xs font-display text-xl font-semibold leading-snug tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{step.copy}</p>
              <div className="mt-auto pt-8">
                <span className="inline-flex rounded-full bg-surface-raised px-3 py-2 font-mono text-xs text-ink">
                  {step.evidence}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
