"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

const DOSSIER_VIEWS = [
  {
    id: "homepage",
    label: "Homepage",
    eyebrow: "How they describe themselves",
    title: "Financial infrastructure to grow your revenue",
    body: "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.",
    facts: ["1,284 words scanned", "4 key headings", "Primary source"],
  },
  {
    id: "news",
    label: "News",
    eyebrow: "What just changed",
    title: "Stripe expands stablecoin payments to more markets",
    body: "Current coverage is grouped with the company research so a message can refer to a genuine, timely event—not a vague compliment.",
    facts: ["6 recent headlines", "Newest first", "Source linked"],
  },
  {
    id: "hiring",
    label: "Hiring",
    eyebrow: "Where attention is going",
    title: "548 open roles across payments infrastructure",
    body: "A careers signal makes the research practical: it shows where a company is putting people and resources right now.",
    facts: ["Greenhouse detected", "Roles sampled", "Careers link included"],
  },
] as const;

export function SampleDossier() {
  const reduceMotion = useLandingMotion();
  const [activeId, setActiveId] = useState<(typeof DOSSIER_VIEWS)[number]["id"]>("homepage");
  const active = DOSSIER_VIEWS.find((view) => view.id === activeId) ?? DOSSIER_VIEWS[0];

  return (
    <section id="sample" className="border-b border-line bg-surface-raised/35">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-28 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <Reveal className="lg:pt-8" axis="x" offset={-22} duration={0.6}>
          <p className="utility-label text-signal-teal">Inside one dossier</p>
          <h2 className="mt-4 max-w-md font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            Research should leave you with something you can use.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
            This is not a score or a black box. It is a clear record of what the company is saying
            and doing, so your next move has context.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-success" />
            Recorded example from stripe.com
          </div>
        </Reveal>

        <Reveal
          className="overflow-hidden rounded-lg border border-line bg-surface shadow-card"
          offset={30}
          duration={0.7}
          delay={0.1}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
            <div>
              <p className="utility-label text-text-secondary">Research dossier</p>
              <p className="mt-1 font-display text-base font-semibold text-ink">stripe.com</p>
            </div>
            <span className="rounded-full bg-success-subtle px-2.5 py-1 text-xs font-semibold text-success">
              Ready
            </span>
          </div>
          <div
            className="flex overflow-x-auto border-b border-line px-3 sm:px-5"
            role="tablist"
            aria-label="Dossier sources"
          >
            {DOSSIER_VIEWS.map((view) => {
              const selected = view.id === activeId;
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`relative shrink-0 px-3 py-4 text-sm font-medium transition-colors ${selected ? "text-ink" : "text-text-secondary hover:text-ink"}`}
                  onClick={() => setActiveId(view.id)}
                >
                  {view.label}
                  {selected ? (
                    <motion.span
                      layoutId="dossier-tab"
                      className="absolute inset-x-3 bottom-0 h-0.5 bg-signal-amber"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="min-h-80 p-5 sm:p-7" role="tabpanel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: LANDING_EASE }}
              >
                <p className="utility-label text-signal-teal">{active.eyebrow}</p>
                <h3 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
                  {active.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                  {active.body}
                </p>
                <div className="mt-10 grid gap-2 sm:grid-cols-3">
                  {active.facts.map((fact) => (
                    <div
                      key={fact}
                      className="rounded-sm border border-line bg-paper px-3 py-3 text-xs text-text-secondary"
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
