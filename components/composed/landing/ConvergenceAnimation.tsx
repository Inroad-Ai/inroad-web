"use client";

import { motion } from "framer-motion";

import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

export type ConvergenceState = "idle" | "running" | "resolved";

/** Three starting points and the single point they all meet at. */
const MEET = { x: 400, y: 200 };
const STARTS = [
  { x: 55, y: 55 },
  { x: 745, y: 55 },
  { x: 400, y: 372 },
];

const OUTLINE = { x: 150, y: 120, width: 500, height: 160, radius: 4 };

/**
 * The signature visual: three thin teal lines travel inward from three points,
 * meet at one, and resolve into a single amber outline once a real result
 * comes back.
 *
 * Purely decorative — `aria-hidden`, and reduced-motion visitors get the
 * finished mark immediately. That static state communicates the same result.
 */
export function ConvergenceAnimation({ state }: { state: ConvergenceState }) {
  const reduceMotion = useLandingMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 400"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {STARTS.map((start, index) => {
        return (
          <motion.line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={MEET.x}
            y2={MEET.y}
            stroke="var(--color-signal-teal)"
            strokeWidth={1}
            initial={false}
            animate={
              state === "running" && !reduceMotion
                ? { opacity: [0.18, 0.72, 0.2], pathLength: [0, 1, 1], pathOffset: [0, 0, 1] }
                : { opacity: state === "resolved" ? 0.28 : 0.2, pathLength: 1, pathOffset: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.15, delay: index * 0.14, ease: LANDING_EASE }
            }
          />
        );
      })}

      {/* The meeting point. Faint until something has actually met there. */}
      <motion.circle
        cx={MEET.x}
        cy={MEET.y}
        r={3}
        fill={
          state === "resolved"
            ? "var(--color-signal-amber)"
            : "var(--color-signal-teal)"
        }
        initial={false}
        animate={{ opacity: state === "idle" ? 0.25 : 0.9, scale: state === "resolved" ? [1, 1.65, 1] : 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.52, ease: LANDING_EASE }}
      />

      {state === "resolved" ? (
        <motion.rect
          x={OUTLINE.x}
          y={OUTLINE.y}
          width={OUTLINE.width}
          height={OUTLINE.height}
          rx={OUTLINE.radius}
          fill="none"
          stroke="var(--color-signal-amber)"
          strokeWidth={1}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.72, ease: LANDING_EASE }}
        />
      ) : null}
    </svg>
  );
}
