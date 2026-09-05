"use client";

import { useReducedMotion } from "framer-motion";

/** Shared motion values for the marketing site. Sections compose these values
 * into their own sequences instead of sharing one generic reveal animation. */
export const LANDING_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const LANDING_EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const LANDING_VIEWPORT = { once: true, amount: 0.22 } as const;
export const LANDING_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 0.8,
} as const;

/** Keeps essential content still and immediately available when the visitor
 * asks their operating system to reduce movement. */
export function useLandingMotion() {
  return useReducedMotion() ?? false;
}
