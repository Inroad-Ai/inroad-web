"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/composed/dashboard/ResultCard";
import { ConvergenceAnimation, type ConvergenceState } from "@/components/composed/landing/ConvergenceAnimation";
import { LANDING_EASE, LANDING_SPRING, useLandingMotion } from "@/lib/landing-motion";
import { SOURCE_KEYS, type CompanyDossier } from "@/lib/types";

/** A real recorded run, shaped exactly like the dossier the tool returns. */
const PREVIEW: CompanyDossier = {
  domain: "stripe.com",
  homepage: {
    url: "https://stripe.com",
    final_url: "https://stripe.com/",
    status_code: 200,
    title: "Stripe | Financial Infrastructure to Grow Your Revenue",
    description:
      "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.",
    headings: [
      "Financial infrastructure to grow your revenue",
      "Modular solutions",
      "Global scale",
    ],
    word_count: 1284,
    body_text: null,
    linkedin_url: null,
    logo_url: null,
  },
  news: {
    query: "stripe.com",
    count: 4,
    items: [
      {
        title: "Stripe expands stablecoin payments to more markets",
        link: "https://example.com/stripe-stablecoin",
        source: "Reuters",
        published: "Tue, 05 Aug 2026 09:12:00 GMT",
      },
      {
        title: "Payments firm reports record annual volume",
        link: "https://example.com/stripe-volume",
        source: "Financial Times",
        published: "Mon, 04 Aug 2026 17:40:00 GMT",
      },
    ],
  },
  hiring: {
    is_hiring: true,
    open_roles: 548,
    source: "greenhouse",
    careers_url: "https://stripe.com/jobs/search",
    company_careers_url: "https://stripe.com/jobs/search",
    sample_roles: [
      "Staff Engineer, Payments Infrastructure",
      "Account Executive, Mid-Market",
    ],
    additional_sources: [],
    sample_role_descriptions: [],
  },
  linkedin: null,
  people: null,
  profile: null,
  errors: {},
  partial: false,
  from_cache: false,
  elapsed_ms: 1615,
};

export function Hero() {
  const reduceMotion = useLandingMotion();
  const [convergenceState, setConvergenceState] = useState<ConvergenceState>(
    reduceMotion ? "resolved" : "running",
  );

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setTimeout(() => setConvergenceState("resolved"), 1350);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const introTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: LANDING_EASE };

  return (
    <header className="overflow-hidden pb-24 pt-16 text-center sm:pb-32 sm:pt-24">
      <motion.div
        className="mx-auto max-w-3xl px-6"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
      >
        <motion.span
          className="utility-label inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-signal-teal"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: introTransition } }}
        >
          Built for job searches, not job boards
        </motion.span>

        <motion.h1
          className="mx-auto mt-6 max-w-3xl font-editorial text-hero tracking-tight text-ink"
          variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: introTransition } }}
        >
          Get an inroad, not a rejection email.
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary"
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: introTransition } }}
        >
          Inroad finds companies that actually match what you&apos;re looking
          for, digs into the funding, team, and tech stack details that make
          a message worth reading, and helps you write outreach to someone
          who can actually hire you. No queue, no black box, just a real
          message to a real person who&apos;d have no idea you did an hour of
          research to write it.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: introTransition } }}
        >
          <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <Button href="/onboarding">Get started</Button>
          </motion.div>
          <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <Button href="#sample" variant="quiet">
            See a sample
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          className="utility-label mt-8 text-text-secondary/70"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: introTransition } }}
        >
          3 sources checked · under 60s per company · no template
        </motion.p>
      </motion.div>

      <div className="relative mt-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 h-96 w-1/2 -translate-x-1/4 translate-y-1/4 rounded-full bg-error/25 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-[28rem] w-2/3 -translate-x-1/2 translate-y-1/4 rounded-full bg-signal-amber-subtle blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-80 w-1/2 translate-x-1/4 translate-y-1/4 rounded-full bg-signal-amber/20 blur-[100px]" />
        </div>

        <motion.div
          className="mx-auto max-w-6xl px-6"
          initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { ...LANDING_SPRING, delay: 0.38 }}
        >
          <p className="utility-label px-1 pb-4 text-left text-text-secondary">
            One run, exactly as it comes back
          </p>
          <div className="relative grid gap-6 text-left sm:grid-cols-3">
            <ConvergenceAnimation state={convergenceState} />
            {SOURCE_KEYS.map((key, index) => (
              <motion.div
                key={key}
                className="relative"
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.58 + index * 0.12, ease: LANDING_EASE }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                <ResultCard source={key} state="done" dossier={PREVIEW} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
