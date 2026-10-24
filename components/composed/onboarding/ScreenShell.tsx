"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Logo } from "@/components/ui/Logo";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

import { PhaseProgress } from "./PhaseProgress";

const SLIDE_OFFSET = 28;

// Functions of `custom` so the leaving step exits by the new direction, not the one it entered with.
const SLIDE: Variants = {
  enter: (offset: number) => ({ opacity: 0, x: offset }),
  center: { opacity: 1, x: 0 },
  exit: (offset: number) => ({ opacity: 0, x: -offset }),
};

/** Chrome shared by every onboarding step: logo, phase progress and theme in
 * the top bar, the step on a card that slides in the direction of travel,
 * and an optional side column on wide screens. */
export function ScreenShell({
  stepKey,
  direction,
  step,
  total,
  phases,
  fills,
  currentPhaseIndex,
  aside,
  children,
}: {
  stepKey: string;
  /** 1 when moving forward, -1 when going back. */
  direction: number;
  step: number;
  total: number;
  phases: readonly string[];
  fills: readonly number[];
  currentPhaseIndex: number;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const isStill = useLandingMotion();
  const offset = isStill ? 0 : SLIDE_OFFSET * direction;
  const phase = phases[currentPhaseIndex];

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 left-1/2 h-full w-full -translate-x-1/2 bg-glow-amber opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 -top-1/4 h-2/3 w-2/3 bg-glow-teal"
      />

      <header className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-4 px-page py-5">
        <Link href="/" aria-label="Inroad home" className="rounded-nest">
          <Logo variant="mark" />
        </Link>
        <div className="order-last w-full sm:order-none sm:mx-auto sm:w-auto sm:max-w-xl sm:flex-1">
          <PhaseProgress
            phases={phases}
            fills={fills}
            currentPhaseIndex={currentPhaseIndex}
            step={step}
            total={total}
          />
        </div>
        <div className="ml-auto sm:ml-0">
          <ThemeControl compact />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-page pb-12 pt-2">
        <div
          className={`mx-auto grid w-full items-start gap-6 ${
            aside ? "max-w-5xl lg:grid-cols-main-aside" : "max-w-2xl"
          }`}
        >
          <AnimatePresence mode="wait" initial={false} custom={offset}>
            <motion.div
              key={stepKey}
              custom={offset}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: LANDING_EASE }}
              className="min-w-0"
            >
              <Card padding="none" className="p-6 sm:p-10">
                {phase ? <Eyebrow className="mb-3">{phase}</Eyebrow> : null}
                {children}
              </Card>
            </motion.div>
          </AnimatePresence>
          {aside ? <div className="sticky top-6 hidden lg:block">{aside}</div> : null}
        </div>
      </main>
    </div>
  );
}
