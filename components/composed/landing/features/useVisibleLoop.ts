"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useLandingMotion } from "@/lib/landing-motion";

/** A step counter that ticks every `intervalMs` while the element is on
 * screen, and never under reduced motion. */
export function useVisibleLoop<T extends HTMLElement>(intervalMs: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduceMotion = useLandingMotion();
  const [step, setStep] = useState(0);
  const running = inView && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, intervalMs]);

  return { ref, step, inView, reduceMotion };
}
