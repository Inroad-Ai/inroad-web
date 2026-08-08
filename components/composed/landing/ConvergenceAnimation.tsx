"use client";

import type { CSSProperties } from "react";

export type ConvergenceState = "idle" | "running" | "resolved";

/** Three starting points and the single point they all meet at. */
const MEET = { x: 400, y: 200 };
const STARTS = [
  { x: 55, y: 55 },
  { x: 745, y: 55 },
  { x: 400, y: 372 },
];

const OUTLINE = { x: 150, y: 120, width: 500, height: 160, radius: 4 };
const OUTLINE_LENGTH = 2 * (OUTLINE.width + OUTLINE.height);

/**
 * The signature visual: three thin teal lines travel inward from three points,
 * meet at one, and resolve into a single amber outline once a real result
 * comes back.
 *
 * Purely decorative — `aria-hidden`, and every animation here is cancelled by
 * the reduced-motion rule in globals.css, which lands each path on its drawn
 * state. That fallback *is* the static converged picture, so nothing is lost.
 */
export function ConvergenceAnimation({ state }: { state: ConvergenceState }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 400"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {STARTS.map((start, index) => {
        const length = Math.hypot(MEET.x - start.x, MEET.y - start.y);

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={MEET.x}
            y2={MEET.y}
            stroke="var(--color-signal-teal)"
            strokeWidth={1}
            strokeDasharray={length}
            className={
              state === "running"
                ? "animate-converge opacity-60"
                : "opacity-20"
            }
            style={
              {
                "--line-length": `${length}`,
                // Not running: the line sits fully drawn. Running: the keyframe
                // owns the offset and redraws it inward on every pass.
                strokeDashoffset: state === "running" ? undefined : 0,
                // Each line starts a beat apart, so they read as three separate
                // things arriving rather than one shape scaling.
                animationDelay: `${index * 0.18}s`,
              } as CSSProperties
            }
          />
        );
      })}

      {/* The meeting point. Faint until something has actually met there. */}
      <circle
        cx={MEET.x}
        cy={MEET.y}
        r={3}
        fill={
          state === "resolved"
            ? "var(--color-signal-amber)"
            : "var(--color-signal-teal)"
        }
        className={state === "idle" ? "opacity-25" : "opacity-90"}
      />

      {state === "resolved" ? (
        <rect
          x={OUTLINE.x}
          y={OUTLINE.y}
          width={OUTLINE.width}
          height={OUTLINE.height}
          rx={OUTLINE.radius}
          fill="none"
          stroke="var(--color-signal-amber)"
          strokeWidth={1}
          strokeDasharray={OUTLINE_LENGTH}
          className="animate-resolve-outline"
          style={
            { "--outline-length": `${OUTLINE_LENGTH}` } as CSSProperties
          }
        />
      ) : null}
    </svg>
  );
}
