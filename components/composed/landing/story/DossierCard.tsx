"use client";

import { motion } from "framer-motion";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { TintBand } from "@/components/ui/TintBand";

import { CARD_VARIANTS, ITEM_VARIANTS, type ChapterState } from "./story-motion";

const DOMAIN = "ledgerline.com";
const FIT = 92;
const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const HEADCOUNT_LINE =
  "M0 27 L20 25.3 L40 23.6 L60 21.9 L80 20.8 L100 19.1 L120 16.8 L140 15.6 L160 13.4 L180 11.7 L200 10 L220 3";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={ITEM_VARIANTS}
      className="grid grid-cols-label-value gap-3.5 border-b border-line py-3 last:border-b-0 md:grid-cols-label-value-wide"
    >
      <span className="utility-label pt-0.5 text-ink-muted">{label}</span>
      <div className="text-sm font-sans-semibold text-ink">{children}</div>
    </motion.div>
  );
}

/** Chapter three: the sample company's dossier, every fact with its source. */
export function DossierCard({ state, still = false }: { state: ChapterState; still?: boolean }) {
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      className="w-full max-w-md overflow-hidden rounded-card bg-surface shadow-pop"
    >
      <TintBand seed={DOMAIN} className="flex items-center gap-3.5 px-5 py-4 text-chalk">
        <CompanyLogo logoUrl={null} seed={DOMAIN} size="lg" className="ring-1 ring-chalk/30" />
        <div>
          <h3 className="text-2xl font-sans-semibold leading-none tracking-heading">Ledgerline</h3>
          <p className="mt-1 text-xs font-sans-semibold opacity-85">ledgerline.com · Series B</p>
        </div>
        <div className="relative ml-auto h-14 w-14 shrink-0" aria-label={`Fit ${FIT}`}>
          <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90" aria-hidden>
            <circle
              cx="28"
              cy="28"
              r={RING_RADIUS}
              strokeWidth="4"
              fill="none"
              className="stroke-chalk/25"
            />
            <circle
              cx="28"
              cy="28"
              r={RING_RADIUS}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - FIT / 100)}
              className="stroke-chalk"
            />
          </svg>
          <b className="absolute inset-0 grid place-items-center text-xl font-sans-semibold">
            {FIT}
          </b>
        </div>
      </TintBand>
      <div className="px-5 pb-4 pt-1.5">
        <Row label="Funding">
          $42M Series B, led by Northzone
          <small className="mt-1 block text-xs font-sans-medium text-ink-muted">
            TechCrunch · 3 weeks ago
          </small>
        </Row>
        <Row label="Team">
          85 people, up 38% in a year
          <svg
            viewBox="0 0 220 30"
            preserveAspectRatio="none"
            className="mt-1.5 h-7 w-full"
            aria-hidden
          >
            <path d={HEADCOUNT_LINE} fill="none" strokeWidth="2" className="stroke-signal-teal" />
          </svg>
        </Row>
        <Row label="Why now">
          Forming a dedicated ledger platform team
          <q className="mt-1.5 block text-sm font-sans-regular text-ink-muted">
            The new money goes first into a ledger platform team...
          </q>
          <small className="mt-1 block text-xs font-sans-medium text-ink-muted">
            ledgerline.com/blog/series-b
          </small>
        </Row>
      </div>
    </motion.div>
  );
}
