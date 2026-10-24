"use client";

import { motion } from "framer-motion";

import { CheckIcon } from "@/components/ui/Icons";
import { SpinnerIcon } from "@/components/ui/Icons";

import { useVisibleLoop } from "./useVisibleLoop";

const DOMAINS = ["gridlight.energy", "parcelwise.io", "atlasfold.com"] as const;
const SOURCES = ["Homepage", "News", "Hiring"] as const;
const CYCLE_MS = 4200;

/** Three sources read side by side for one domain, then the next domain. */
export function ResearchMini() {
  const { ref, step, reduceMotion } = useVisibleLoop<HTMLDivElement>(CYCLE_MS);
  return (
    <div ref={ref} className="grid gap-2.5">
      <div className="flex min-h-10 items-center rounded-nest border border-ink/15 bg-ink/5 px-3.5 text-sm font-sans-semibold text-ink">
        {DOMAINS[step % DOMAINS.length]}
      </div>
      {SOURCES.map((label, k) => (
        <div
          key={`${label}-${step}`}
          className="grid grid-cols-checklist items-center gap-2.5 text-sm font-sans-semibold text-ink"
        >
          <span>{label}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <motion.span
              className="block h-full origin-left rounded-full bg-signal-teal"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1 + k * 0.45, ease: "easeInOut" }}
            />
          </span>
          <span className="relative grid h-5 w-5 place-items-center text-signal-teal">
            <SpinnerIcon />
            <motion.span
              aria-hidden
              className="absolute inset-0 grid place-items-center rounded-full bg-signal-teal text-paper"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 1 + k * 0.45, duration: 0.2 }}
            >
              <CheckIcon className="h-3 w-3" />
            </motion.span>
          </span>
        </div>
      ))}
    </div>
  );
}
