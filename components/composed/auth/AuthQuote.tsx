"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { LANDING_EASE } from "@/lib/landing-motion";
import { TESTIMONIALS } from "@/lib/testimonials";

const ROTATE_MS = 7000;

/** One testimonial at a time, crossfading to the next. */
export function AuthQuote({ isStill }: { isStill: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isStill) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % TESTIMONIALS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [isStill]);

  const testimonial = TESTIMONIALS[index];

  return (
    <figure className="grid">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: LANDING_EASE }}
          className="col-start-1 row-start-1"
        >
          <blockquote className="max-w-md text-xl font-sans-medium tracking-heading text-ink">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="utility-label mt-3.5 text-ink-muted">
            {testimonial.name} · {testimonial.role}
          </figcaption>
        </motion.div>
      </AnimatePresence>
    </figure>
  );
}
