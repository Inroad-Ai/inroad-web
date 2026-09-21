"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

export type ConvergenceState = "idle" | "running" | "resolved";

type Point = { x: number; y: number };
type Geometry = { starts: Point[]; meet: Point };

/** How far above the result box the lines meet, so the dot sits in the gap
 * rather than sitting on top of the box's own border. */
const MEET_MARGIN = 10;

/** Measures the real card and result-box positions rather than assuming
 * fixed coordinates, since the preview panel's layout (padding, card
 * height, text wrapping) doesn't match any single hardcoded aspect ratio. */
function measure(containerEl: HTMLElement): Geometry | null {
  const startEls = Array.from(
    containerEl.querySelectorAll<HTMLElement>("[data-convergence-start]"),
  );
  const targetEl = containerEl.querySelector<HTMLElement>("[data-convergence-target]");
  if (startEls.length === 0 || !targetEl) return null;

  const containerRect = containerEl.getBoundingClientRect();
  const relativeX = (rect: DOMRect) => rect.left + rect.width / 2 - containerRect.left;

  const starts = startEls.map((el) => {
    const rect = el.getBoundingClientRect();
    return { x: relativeX(rect), y: rect.bottom - containerRect.top };
  });

  const targetRect = targetEl.getBoundingClientRect();
  const meet = { x: relativeX(targetRect), y: targetRect.top - containerRect.top - MEET_MARGIN };

  return { starts, meet };
}

/**
 * The signature visual: three thin teal lines travel from the signal cards
 * down to a meeting point just above the "useful opening" box, settling
 * into a quiet, connected state once a real result comes back — the box
 * itself carries the "resolved" moment with a brief amber pulse rather than
 * a second outline drawn on top of its own border.
 *
 * Purely decorative — `aria-hidden`, and reduced-motion visitors get the
 * finished mark immediately. That static state communicates the same result.
 */
export function ConvergenceAnimation({
  state,
  containerRef,
}: {
  state: ConvergenceState;
  containerRef: RefObject<HTMLElement>;
}) {
  const reduceMotion = useLandingMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const recompute = () => setGeometry(measure(containerEl));
    recompute();

    const observer = new ResizeObserver(recompute);
    observer.observe(containerEl);
    return () => observer.disconnect();
    // Re-measure on every state change too: the target box only occupies
    // its layout position once it exists, and re-running a cheap
    // getBoundingClientRect pass here is simpler than trying to predict it.
  }, [containerRef, state]);

  if (!geometry) return null;

  const { starts, meet } = geometry;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      {starts.map((start, index) => (
        <motion.line
          key={index}
          x1={start.x}
          y1={start.y}
          x2={meet.x}
          y2={meet.y}
          stroke="rgb(var(--color-signal-teal))"
          strokeWidth={1}
          strokeLinecap="round"
          initial={false}
          animate={
            state === "running" && !reduceMotion
              ? { opacity: [0.18, 0.72, 0.2], pathLength: [0, 1, 1], pathOffset: [0, 0, 1] }
              : { opacity: state === "resolved" ? 0.16 : 0.2, pathLength: 1, pathOffset: 0 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : state === "running"
                ? { duration: 1.15, delay: index * 0.14, ease: LANDING_EASE }
                : { duration: 0.5, ease: LANDING_EASE }
          }
        />
      ))}

      {/* The meeting point. Flashes amber once a result actually lands there. */}
      <motion.circle
        cx={meet.x}
        cy={meet.y}
        r={3}
        initial={false}
        animate={{
          opacity: state === "idle" ? 0.25 : state === "resolved" ? 0.85 : 0.9,
          scale: state === "resolved" && !reduceMotion ? [1, 1.9, 1] : 1,
          fill:
            state === "resolved"
              ? "rgb(var(--color-signal-amber))"
              : "rgb(var(--color-signal-teal))",
        }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: LANDING_EASE }}
      />
    </svg>
  );
}
