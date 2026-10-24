"use client";

import { motion } from "framer-motion";

import { LANDING_EASE_STANDARD } from "@/lib/landing-motion";

import type { CursorState } from "./console.types";

const TRAVEL_SECONDS = 0.8;

/** The pointer that clicks through the scripted demo. */
export function DemoCursor({ cursor }: { cursor: CursorState }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 h-6 w-6 drop-shadow-md"
      initial={false}
      animate={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 1 : 0 }}
      transition={
        cursor.instant ? { duration: 0 } : { duration: TRAVEL_SECONDS, ease: LANDING_EASE_STANDARD }
      }
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path
          d="M4 2l16 9.5-7 1.6-3.6 6.4z"
          className="fill-on-amber stroke-chalk"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
