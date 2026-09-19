"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

type Point = { x: number; y: number };
type Geometry = { badges: Point[]; hub: Point };

/** Measures the real badge and card positions so every line ends exactly
 * where its badge and the card center actually are, instead of assuming
 * fixed coordinates that drift the moment the layout changes. */
function measure(containerEl: HTMLElement): Geometry | null {
  const badgeEls = Array.from(containerEl.querySelectorAll<HTMLElement>("[data-node]"));
  const cardEl = containerEl.querySelector<HTMLElement>("[data-hub-card]");
  if (badgeEls.length === 0 || !cardEl) return null;

  const containerRect = containerEl.getBoundingClientRect();
  const toPoint = (rect: DOMRect): Point => ({
    x: rect.left + rect.width / 2 - containerRect.left,
    y: rect.top + rect.height / 2 - containerRect.top,
  });

  return {
    badges: badgeEls.map((el) => toPoint(el.getBoundingClientRect())),
    hub: toPoint(cardEl.getBoundingClientRect()),
  };
}

/** Every badge, on either side, draws one straight line into the same
 * single point at the card's center — one true convergence, not two
 * separate hubs. */
export function IntegrationsConnectors({ containerRef }: { containerRef: RefObject<HTMLElement> }) {
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
  }, [containerRef]);

  if (!geometry) return null;

  const { badges, hub } = geometry;

  const DOT_DURATION = 0.3;
  const LINE_DELAY = reduceMotion ? 0 : DOT_DURATION + 0.05;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
    >
      {badges.map((badge, index) => (
        <motion.line
          key={index}
          x1={hub.x}
          y1={hub.y}
          x2={badge.x}
          y2={badge.y}
          stroke="rgb(var(--color-signal-amber))"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: LINE_DELAY, ease: LANDING_EASE }}
        />
      ))}
      <motion.circle
        cx={hub.x}
        cy={hub.y}
        r={3}
        fill="rgb(var(--color-signal-amber))"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 0.9, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={reduceMotion ? { duration: 0 } : { duration: DOT_DURATION, ease: LANDING_EASE }}
      />
    </svg>
  );
}
