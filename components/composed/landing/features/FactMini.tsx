"use client";

import { motion } from "framer-motion";

import { ExternalLinkIcon } from "@/components/ui/Icons";

import { useVisibleLoop } from "./useVisibleLoop";

const SWEEP_MS = 4200;

/** A sourced quote whose key phrase gets highlighted, again and again. */
export function FactMini() {
  const { ref, step, inView, reduceMotion } = useVisibleLoop<HTMLDivElement>(SWEEP_MS);
  const lit = reduceMotion || inView;
  return (
    <div ref={ref} className="grid gap-3">
      <p className="text-lg text-ink">
        “...today we&apos;re announcing our{" "}
        <motion.mark
          key={step}
          className="bg-transparent bg-gradient-to-r from-signal-amber-subtle to-signal-amber-subtle bg-bottom bg-no-repeat text-inherit"
          initial={reduceMotion ? false : { backgroundSize: "0% 40%" }}
          animate={{ backgroundSize: lit ? "100% 40%" : "0% 40%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        >
          $42M Series B, led by Northzone
        </motion.mark>
        ...”
      </p>
      <span className="flex items-center gap-2 text-xs font-sans-semibold text-signal-teal">
        <ExternalLinkIcon className="h-3.5 w-3.5" />
        ledgerline.com/blog/series-b
      </span>
    </div>
  );
}
