import type { Variants } from "framer-motion";

import { LANDING_EASE } from "@/lib/landing-motion";

/** Where a chapter sits relative to the one on screen: still to come,
 * showing, or already scrolled past. */
export type ChapterState = "upcoming" | "active" | "past";

export const chapterStateFor = (index: number, active: number): ChapterState =>
  index === active ? "active" : index < active ? "past" : "upcoming";

export const WORD_VARIANTS: Variants = {
  upcoming: { y: "110%", opacity: 0 },
  active: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: LANDING_EASE } },
  past: { y: "-110%", opacity: 0, transition: { duration: 0.3 } },
};

export const LINE_VARIANTS: Variants = {
  upcoming: { y: 26, opacity: 0 },
  active: { y: 0, opacity: 1, transition: { duration: 0.5, ease: LANDING_EASE, delay: 0.15 } },
  past: { y: -22, opacity: 0, transition: { duration: 0.3 } },
};

export const CARD_VARIANTS: Variants = {
  upcoming: { y: 50, opacity: 0, scale: 0.96 },
  active: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: LANDING_EASE,
      delay: 0.1,
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
  past: { y: -40, opacity: 0, scale: 0.94, transition: { duration: 0.35 } },
};

export const ITEM_VARIANTS: Variants = {
  upcoming: { opacity: 0, scale: 0.85 },
  active: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: LANDING_EASE } },
  past: { opacity: 1, scale: 1 },
};
