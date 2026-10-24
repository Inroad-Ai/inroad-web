"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Shared motion values for the marketing site. Sections compose these values
 * into their own sequences instead of sharing one generic reveal animation. */
export const LANDING_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const LANDING_EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const LANDING_VIEWPORT = { once: true, amount: 0.22 } as const;

/** Keeps essential content still and immediately available when the visitor
 * asks their operating system to reduce movement.
 *
 * `matchMedia` doesn't exist during SSR, so the server always renders as if
 * motion is allowed. Returning `false` until after mount keeps the first
 * client render identical to that SSR output — otherwise a reduced-motion
 * visitor's hydration render disagrees with the server's and React throws a
 * hydration mismatch on every animated section. */
export function useLandingMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && (prefersReducedMotion ?? false);
}
