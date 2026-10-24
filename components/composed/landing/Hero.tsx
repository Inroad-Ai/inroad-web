"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, SparkIcon } from "@/components/ui/Icons";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";
import { SECTION_IDS } from "@/lib/landing/sections";

import { AskConsole, CONSOLE_ANCHOR } from "./console/AskConsole";
import { RevealHeadline } from "./RevealHeadline";

const ENTRANCE_DELAY = 0.35;
const ENTRANCE_STAGGER = 0.1;

export function Hero() {
  const reduceMotion = useLandingMotion();
  const rise = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            duration: 1.1,
            ease: LANDING_EASE,
            delay: ENTRANCE_DELAY + order * ENTRANCE_STAGGER,
          },
        };

  return (
    <section
      id={SECTION_IDS.top}
      className="relative isolate flex min-h-screen flex-col items-center overflow-hidden px-4 pb-16 pt-28 text-center sm:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-96 w-96 scale-150 bg-glow-teal blur-sm" />
        <div className="absolute -left-40 top-1/4 h-96 w-96 scale-125 bg-glow-ember blur-sm" />
        <div className="absolute -bottom-48 left-1/2 h-96 w-full max-w-5xl -translate-x-1/2 scale-y-150 bg-glow-amber blur-sm" />
      </div>

      <motion.a
        {...rise(0)}
        href={`#${SECTION_IDS.features}`}
        className="inline-flex h-9 items-center gap-2.5 rounded-full border border-ink/15 bg-surface pl-1 pr-3.5 text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:text-ink"
      >
        <span className="utility-label grid h-6 place-items-center rounded-full bg-signal-amber px-2.5 text-on-amber">
          New
        </span>
        Follow-ups that stop when they reply
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </motion.a>

      <RevealHeadline
        as="h1"
        trigger="mount"
        delay={0.15}
        className="mx-auto mt-6 max-w-4xl text-hero text-ink"
        lines={[{ text: "Get an inroad," }, { text: "not a rejection email.", muted: true }]}
      />

      <motion.p {...rise(1)} className="mx-auto mt-6 max-w-xl text-lg text-ink-muted">
        Inroad finds companies that fit you, reads up on each one, finds the person who can hire
        you, and drafts a note that sounds like you did an hour of homework. You send it from your
        own Gmail.
      </motion.p>

      <motion.div {...rise(2)} className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button href="/signup" size="lg" icon={<ArrowRightIcon />} iconPosition="end">
          Get started free
        </Button>
        <Button href={`#${CONSOLE_ANCHOR}`} variant="quiet" size="lg" icon={<SparkIcon />}>
          Try the console
        </Button>
      </motion.div>

      <motion.p {...rise(3)} className="utility-label mt-4 text-ink-faint">
        Free during early access · Nothing sends without you
      </motion.p>

      <motion.div {...rise(4)} className="w-full">
        <AskConsole />
      </motion.div>

      <motion.div
        {...rise(5)}
        className="mt-11 flex flex-wrap items-center justify-center gap-4 text-sm font-sans-semibold text-ink-muted"
      >
        <span aria-hidden className="h-10 w-px bg-gradient-to-b from-ink-muted to-transparent" />
        <span>Scroll for the story of one email</span>
        <span aria-hidden>·</span>
        <a
          href={`#${SECTION_IDS.afterStory}`}
          className="text-ink underline underline-offset-4 hover:text-signal-teal"
        >
          Skip the story
        </a>
      </motion.div>
    </section>
  );
}
