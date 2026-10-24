"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useVisibleLoop } from "./useVisibleLoop";

const TONES = [
  {
    label: "Warmer",
    line: "Hope your week is going well. Congrats on the Series B, the ledger platform team caught my eye.",
  },
  {
    label: "Shorter",
    line: "Congrats on the Series B. I've built the ledger platform you're hiring for.",
  },
  {
    label: "More specific",
    line: "Your Go write-path post reads like our Payvault postmortem: reconciliation went from 6 hours to 11 minutes.",
  },
  {
    label: "More formal",
    line: "I hope this finds you well. Congratulations on Ledgerline's Series B and the new ledger platform team.",
  },
] as const;
const CYCLE_MS = 2800;

/** One line of a draft, rewritten in each tone in turn. */
export function ToneMini() {
  const { ref, step } = useVisibleLoop<HTMLDivElement>(CYCLE_MS);
  const current = step % TONES.length;
  return (
    <div ref={ref} className="grid gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TONES.map((tone, i) => (
          <span
            key={tone.label}
            className={`rounded-full border px-3 py-1.5 text-xs font-sans-bold transition-colors duration-base ${
              i === current ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink-muted"
            }`}
          >
            {tone.label}
          </span>
        ))}
      </div>
      <div className="min-h-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current}
            className="text-lg font-sans-semibold leading-snug text-ink"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {TONES[current].line}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
