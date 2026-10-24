"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { LANDING_EASE } from "@/lib/landing-motion";

import { AUTH_PANEL_EVENTS, VISIBLE_EVENTS } from "./auth-panel-events";

// Matches NodeField's ambient LIGHT_EVERY, so each new chip lands as a node lights.
const CYCLE_MS = 3000;
const ENTER_OFFSET = 14;
const BASE_OPACITY = 0.76;
const OPACITY_STEP = 0.12;

/** Three event chips; every few seconds a new one joins at the bottom and the oldest leaves. */
export function AuthEventStack({ isStill }: { isStill: boolean }) {
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (isStill) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setHead((value) => value + 1);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [isStill]);

  const visible = Array.from({ length: VISIBLE_EVENTS }, (_, slot) => head + slot);

  return (
    <ul aria-hidden className="relative grid gap-2.5">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((sequence, slot) => {
          const event = AUTH_PANEL_EVENTS[sequence % AUTH_PANEL_EVENTS.length];
          return (
            <motion.li
              key={sequence}
              layout
              initial={{ opacity: 0, y: ENTER_OFFSET }}
              animate={{ opacity: BASE_OPACITY + slot * OPACITY_STEP, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: LANDING_EASE }}
              className="flex h-14 items-center gap-3 rounded-card bg-panel-chip pl-3 pr-4 shadow-card"
            >
              <CompanyLogo logoUrl={null} seed={event.domain} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm font-sans-medium text-ink-muted">
                <b className="font-sans-bold text-ink">{event.company}</b> · {event.text}
              </span>
              <span className="whitespace-nowrap font-mono text-2xs text-ink-faint">just now</span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
