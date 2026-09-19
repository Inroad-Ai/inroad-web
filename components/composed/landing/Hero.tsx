"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  ConvergenceAnimation,
  type ConvergenceState,
} from "@/components/composed/landing/ConvergenceAnimation";
import { Button } from "@/components/ui/Button";
import { LANDING_EASE, LANDING_SPRING, useLandingMotion } from "@/lib/landing-motion";

const SIGNALS = [
  { label: "Homepage", detail: "Positioning captured", tone: "bg-signal-teal" },
  { label: "News", detail: "6 current signals", tone: "bg-signal-amber" },
  { label: "Hiring", detail: "548 open roles", tone: "bg-success" },
] as const;

/** The first screen answers the product question before asking for a click. */
export function Hero() {
  const reduceMotion = useLandingMotion();
  const previewRef = useRef<HTMLDivElement>(null);
  const [convergenceState, setConvergenceState] = useState<ConvergenceState>(
    reduceMotion ? "resolved" : "running",
  );

  useEffect(() => {
    if (reduceMotion) {
      setConvergenceState("resolved");
      return;
    }
    const timer = window.setTimeout(() => setConvergenceState("resolved"), 1250);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const intro = reduceMotion ? { duration: 0 } : { duration: 0.66, ease: LANDING_EASE };

  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[30rem] bg-signal-amber-subtle/35" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(30rem,1.12fr)] lg:items-center lg:gap-16 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p
            className="utility-label flex items-center gap-2 text-signal-teal"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: intro } }}
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-signal-amber" />
            Research-led job search
          </motion.p>
          <motion.h1
            className="mt-5 max-w-xl font-display text-hero font-semibold tracking-[-0.055em] text-ink"
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: intro } }}
          >
            Find the reason <span className="text-signal-amber">to reach out.</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: intro } }}
          >
            Inroad turns a company domain into the useful context behind a
            thoughtful message: what they say, what just happened, and where
            they are hiring. No job-board queue required.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: intro } }}
          >
            <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <Button href="/onboarding">Start researching</Button>
            </motion.div>
            <Button href="#sample" variant="quiet">Explore a dossier</Button>
          </motion.div>
          <motion.div
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: intro } }}
          >
            <span>One company at a time</span>
            <span aria-hidden className="text-signal-amber">•</span>
            <span>Review every message yourself</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { ...LANDING_SPRING, delay: 0.22 }}
        >
          <div className="relative overflow-hidden rounded-lg border border-line bg-surface shadow-overlay">
            <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-rose" />
                <span className="h-2 w-2 rounded-full bg-signal-amber" />
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>
              <span className="utility-label text-text-secondary">New research</span>
            </div>
            <div ref={previewRef} className="relative p-4 sm:p-6">
              <ConvergenceAnimation state={convergenceState} containerRef={previewRef} />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="utility-label text-text-secondary">Company domain</p>
                  <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">stripe.com</p>
                </div>
                <motion.span
                  className="rounded-full bg-success-subtle px-3 py-1.5 text-xs font-semibold text-success"
                  animate={convergenceState === "resolved" ? { opacity: 1 } : { opacity: 0.55 }}
                >
                  {convergenceState === "resolved" ? "Research ready" : "Checking sources"}
                </motion.span>
              </div>
              <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
                {SIGNALS.map((signal, index) => (
                  <motion.div
                    key={signal.label}
                    data-convergence-start
                    className="rounded-md border border-line bg-paper p-3.5"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.42, delay: 0.55 + index * 0.12, ease: LANDING_EASE }}
                  >
                    <span className={`block h-1.5 w-7 rounded-full ${signal.tone}`} />
                    <p className="mt-4 font-display text-sm font-semibold text-ink">{signal.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">{signal.detail}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                data-convergence-target
                className="relative mt-4 rounded-md border border-signal-teal/25 bg-signal-teal-subtle/55 p-4"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{
                  opacity: convergenceState === "resolved" ? 1 : 0,
                  boxShadow:
                    convergenceState === "resolved" && !reduceMotion
                      ? [
                          "0 0 0 0 rgb(var(--color-signal-amber) / 0)",
                          "0 0 0 8px rgb(var(--color-signal-amber) / 0.18)",
                          "0 0 0 0 rgb(var(--color-signal-amber) / 0)",
                        ]
                      : "0 0 0 0 rgb(var(--color-signal-amber) / 0)",
                }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: LANDING_EASE }}
              >
                <p className="utility-label text-signal-teal">A useful opening</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  Stripe is expanding stablecoin payments while hiring across payments infrastructure.
                </p>
              </motion.div>
            </div>
          </div>
          <div aria-hidden className="absolute -bottom-5 -left-5 -z-10 h-32 w-32 rounded-full bg-signal-amber/25 blur-3xl" />
        </motion.div>
      </div>
    </header>
  );
}
