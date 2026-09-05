"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

// Measured against stripe.com on a home connection: homepage 1093ms, news
// 296ms, hiring 1455ms. Run one after another that is their sum; run together
// it is the slowest one, plus overhead.
const SEQUENTIAL_MS = 2843;
const CONCURRENT_MS = 765;

export function SpeedComparison() {
  const reduceMotion = useLandingMotion();
  const ratio = (CONCURRENT_MS / SEQUENTIAL_MS) * 100;

  return (
    <section id="speed" className="overflow-hidden border-t border-line bg-surface-raised/45">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.52, ease: LANDING_EASE }}
        >
          <p className="utility-label text-text-secondary">Why it is quick</p>
          <h2 className="mt-4 max-w-2xl font-editorial text-2xl leading-snug tracking-tight text-ink sm:text-3xl">
            The three checks do not wait for each other.
          </h2>
        </motion.div>

        <div className="mt-10 max-w-3xl space-y-6 sm:mt-14">
          <Bar label="One at a time" ms={SEQUENTIAL_MS} widthPercent={100} tone="bg-line" />
          <Bar label="All at once" ms={CONCURRENT_MS} widthPercent={ratio} tone="bg-signal-amber" />
        </div>

        <motion.p
          className="mt-8 max-w-2xl text-sm leading-relaxed text-text-secondary"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={LANDING_VIEWPORT}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.52, delay: 0.18, ease: LANDING_EASE }}
        >
          Both bars are the same three checks. Waiting on each in turn costs
          their total; starting them together costs the slowest one. If a source
          is down, it stops at its own deadline and the other two still come
          back.
        </motion.p>
      </div>
    </section>
  );
}

function Bar({ label, ms, widthPercent, tone }: { label: string; ms: number; widthPercent: number; tone: string }) {
  const reduceMotion = useLandingMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const value = useMotionValue(reduceMotion ? ms : 0);
  const [displayedMilliseconds, setDisplayedMilliseconds] = useState(reduceMotion ? ms : 0);

  useMotionValueEvent(value, "change", (latest) => setDisplayedMilliseconds(Math.round(latest)));

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(value, ms, { duration: 0.9, ease: LANDING_EASE });
    return () => controls.stop();
  }, [isInView, ms, reduceMotion, value]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="utility-label text-text-secondary">{label}</span>
        <span className="font-display text-lg text-ink">{(displayedMilliseconds / 1000).toFixed(2)}s</span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-surface">
        <motion.div
          className={`h-3 rounded-full ${tone}`}
          initial={reduceMotion ? false : { width: "0%" }}
          whileInView={{ width: `${widthPercent}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: LANDING_EASE }}
        />
      </div>
    </div>
  );
}
