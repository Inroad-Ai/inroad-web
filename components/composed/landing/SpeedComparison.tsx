"use client";

import { motion } from "framer-motion";

import { Reveal } from "@/components/ui/Reveal";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

const CHECKS = [
  { label: "Homepage", ms: 1090 },
  { label: "News", ms: 300 },
  { label: "Hiring", ms: 1460 },
] as const;

const SLOWEST_MS = Math.max(...CHECKS.map((check) => check.ms));

export function SpeedComparison() {
  const reduceMotion = useLandingMotion();

  return (
    <section id="speed" className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
          <Reveal offset={22} duration={0.58}>
            <p className="utility-label text-signal-amber">Built for momentum</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold tracking-[-0.045em] text-paper sm:text-4xl">
              Good research should not slow down{" "}
              <span className="text-signal-amber">a good lead.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-paper/70">
              Inroad starts the independent checks together. A slow source does not make the rest of
              the brief wait around.
            </p>
          </Reveal>

          <Reveal
            className="rounded-lg border border-paper/15 bg-paper/5 p-5 sm:p-7"
            axis="x"
            offset={30}
            duration={0.65}
            delay={0.12}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="utility-label text-paper/55">A typical run</p>
              <span className="rounded-full bg-signal-amber px-3 py-1.5 text-xs font-semibold text-ink">
                All together
              </span>
            </div>
            <div className="mt-8 space-y-4">
              {CHECKS.map((check, index) => (
                <div
                  key={check.label}
                  className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[7rem_1fr_auto]"
                >
                  <span className="text-sm text-paper/75">{check.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-paper/10">
                    <motion.div
                      className="h-full rounded-full bg-signal-teal"
                      initial={reduceMotion ? false : { width: "0%" }}
                      whileInView={{ width: `${(check.ms / SLOWEST_MS) * 100}%` }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.74, delay: 0.2 + index * 0.1, ease: LANDING_EASE }
                      }
                    />
                  </div>
                  <span className="font-mono text-xs text-paper/55">
                    {(check.ms / 1000).toFixed(2)}s
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-paper/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xs text-sm leading-relaxed text-paper/65">
                The total is shaped by the slowest check, not the sum of all three.
              </p>
              <div className="shrink-0 sm:text-right">
                <p className="utility-label text-paper/55">Recorded sample</p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-paper">
                  1.62s
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
