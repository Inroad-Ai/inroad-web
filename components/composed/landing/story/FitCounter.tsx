"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";

import { FIT_COUNT, MARKET_SIZE } from "@/lib/landing/story-chapters";

/** Where the node field stops gathering and starts filtering (matches the
 * story mode of ui/NodeField). */
const FILTER_FROM = 0.4;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function countFor(fieldProgress: number) {
  const filter = Math.min(1, Math.max(0, (fieldProgress - FILTER_FROM) / (1 - FILTER_FROM)));
  const count = Math.round(MARKET_SIZE - (MARKET_SIZE - FIT_COUNT) * easeInOut(filter));
  const label =
    count <= FIT_COUNT
      ? "fit what you asked for"
      : filter > 0.02
        ? "still in the running"
        : "companies in your market";
  return { count, label };
}

/** Chapter two's count, falling from the whole market to the fits. */
export function FitCounter({ fieldProgress }: { fieldProgress: MotionValue<number> }) {
  const [state, setState] = useState(() => countFor(fieldProgress.get()));
  useMotionValueEvent(fieldProgress, "change", (value) => setState(countFor(value)));

  return (
    <div className="mt-4 flex flex-wrap items-baseline gap-3.5 md:mt-7">
      <b className="font-display text-section font-sans-semibold tabular-nums tracking-display text-ink">
        {state.count.toLocaleString("en-US")}
      </b>
      <span className="max-w-40 text-sm font-sans-semibold text-ink-muted">{state.label}</span>
    </div>
  );
}
