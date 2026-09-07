"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const FAQS = [
  {
    question: "How is this different from Simplify or a job board?",
    answer: "Job boards get you into a queue behind a thousand other applicants and an ATS filter. Inroad takes a different route: it researches a company and gives you specifics for a direct, thoughtful message.",
  },
  {
    question: "Do you send emails automatically?",
    answer: "No. Every message Inroad helps you draft is yours to read, edit, and send. Nothing goes out on your behalf.",
  },
  {
    question: "Is my data safe?",
    answer: "Your data is stored in Inroad's Postgres database and every query is scoped to your account. Resumes are parsed and discarded rather than retained as files. Inroad is early, so treat it accordingly and do not add anything you would not want stored in a new service.",
  },
  {
    question: "Is it free?",
    answer: "It is free during early access. Pricing comes later, once the product has earned the right to charge for it.",
  },
] as const;

export function Faq() {
  const reduceMotion = useLandingMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-28 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
        >
          <p className="utility-label text-signal-teal">Good to know</p>
          <h2 className="mt-4 max-w-sm font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            Clear answers, before you start.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary sm:text-base">
            Inroad is intentionally straightforward about what it does, what it does not automate, and where it is today.
          </p>
        </motion.div>

        <div className="rounded-lg border border-line bg-surface px-5 sm:px-7">
          {FAQS.map((item, index) => {
            const isOpen = index === openIndex;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <motion.div
                key={item.question}
                className="border-b border-line last:border-b-0"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={LANDING_VIEWPORT}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.42, delay: index * 0.06, ease: LANDING_EASE }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">{item.question}</span>
                  <motion.span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-lg leading-none text-signal-teal"
                    animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "var(--color-signal-teal-subtle)" : "var(--color-surface)" }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: LANDING_EASE }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: LANDING_EASE }}
                    >
                      <p className="max-w-xl pb-5 text-sm leading-relaxed text-text-secondary sm:text-base">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
