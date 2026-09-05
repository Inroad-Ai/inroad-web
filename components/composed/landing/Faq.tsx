"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

const FAQS = [
  {
    question: "How is this different from Simplify or a job board?",
    answer:
      "Job boards get you into a queue behind a thousand other applicants and an ATS filter. Inroad skips the queue: it researches a company and helps you send a message straight to someone there, backed by specifics that show you didn't mass-apply.",
  },
  {
    question: "Do you send emails automatically?",
    answer:
      "No, not yet. Every message Inroad drafts is something you read, edit, and send yourself. Nothing goes out on your behalf.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your data sits in our own Postgres database, and every query that reads it is scoped to your account, so it's not readable by other users. Resumes are parsed and discarded, never stored as files. Inroad is early: treat it accordingly, and don't put anything in it you wouldn't want stored anywhere new.",
  },
  {
    question: "Is it free?",
    answer:
      "Free during early access. Pricing will come later, once there's a version of the product worth charging for.",
  },
] as const;

export function Faq() {
  const reduceMotion = useLandingMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.h2
          className="font-editorial text-2xl tracking-tight text-ink sm:text-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.56, ease: LANDING_EASE }}
        >
          Questions
        </motion.h2>

        <div className="mt-10 divide-y divide-line border-y border-line sm:mt-14">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <motion.div
                key={item.question}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={LANDING_VIEWPORT}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.42, delay: index * 0.06, ease: LANDING_EASE }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base text-ink sm:text-lg"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <motion.span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-signal-teal"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: LANDING_EASE }}
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
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { height: 0, opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0, transition: { duration: 0.2, ease: LANDING_EASE } }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: LANDING_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-5 font-sans text-sm leading-relaxed text-text-secondary sm:text-base">
                        {item.answer}
                      </p>
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
