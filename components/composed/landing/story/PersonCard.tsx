"use client";

import { motion } from "framer-motion";

import { CheckIcon } from "@/components/ui/Icons";

import { CARD_VARIANTS, ITEM_VARIANTS, type ChapterState } from "./story-motion";

const COMMON_GROUND = [
  "Both ex-payments infrastructure",
  "Spoke at GopherCon EU 2025",
  "TU Berlin alum",
] as const;

/** Chapter four: the person who runs the team, and what you share. */
export function PersonCard({ state, still = false }: { state: ChapterState; still?: boolean }) {
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      className="grid w-full max-w-md gap-4 rounded-card bg-surface p-5 shadow-pop"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="grid h-24 w-20 shrink-0 place-items-center rounded-card bg-gradient-to-br from-monogram-5 to-monogram-1 text-3xl font-sans-semibold text-chalk md:h-28 md:w-24"
        >
          PN
        </span>
        <div className="min-w-0">
          <h3 className="text-2xl font-sans-semibold leading-tight tracking-heading text-ink">
            Priya Natarajan
          </h3>
          <p className="mt-1.5 text-sm font-sans-semibold text-ink-muted">
            VP Engineering at Ledgerline
          </p>
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-sans-bold text-signal-teal">
            <CheckIcon className="h-3.5 w-3.5" />
            <span className="break-all">priya@ledgerline.com verified</span>
          </p>
        </div>
      </div>
      <div>
        <p className="utility-label text-ink-muted">Common ground</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {COMMON_GROUND.map((item) => (
            <motion.li
              key={item}
              variants={ITEM_VARIANTS}
              className="inline-flex items-center gap-2 rounded-full border border-signal-teal/30 bg-signal-teal-subtle px-3 py-2 text-sm font-sans-semibold text-ink"
            >
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-teal" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
