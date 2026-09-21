"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

type RevealProps = {
  children: ReactNode;
  /** Tag to render the wrapper as, for semantic call sites like "li" inside an <ol>. */
  as?: "div" | "li" | "p" | "article";
  /** Which axis the offset animates on. */
  axis?: "x" | "y";
  /** Starting distance from rest, in px. 0 fades in place. */
  offset?: number;
  duration?: number;
  delay?: number;
  viewport?: typeof LANDING_VIEWPORT;
} & Omit<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport" | "transition" | "children"
>;

/** Fades a section in with a small directional offset once it scrolls into
 * view. Covers the common landing-page reveal; a section with genuinely
 * different motion (a mount-time slide, a staggered group, an accordion)
 * should keep its own motion.div instead of forcing this shape. */
export function Reveal({
  children,
  as = "div",
  axis = "y",
  offset = 22,
  duration = 0.58,
  delay = 0,
  viewport = LANDING_VIEWPORT,
  ...rest
}: RevealProps) {
  const reduceMotion = useLandingMotion();

  const sharedProps = {
    initial: reduceMotion ? false : { opacity: 0, [axis]: offset },
    whileInView: { opacity: 1, [axis]: 0 },
    viewport,
    transition: reduceMotion ? { duration: 0 } : { duration, delay, ease: LANDING_EASE },
    ...rest,
  };

  switch (as) {
    case "li":
      return <motion.li {...(sharedProps as HTMLMotionProps<"li">)}>{children}</motion.li>;
    case "p":
      return <motion.p {...(sharedProps as HTMLMotionProps<"p">)}>{children}</motion.p>;
    case "article":
      return (
        <motion.article {...(sharedProps as HTMLMotionProps<"article">)}>{children}</motion.article>
      );
    default:
      return <motion.div {...(sharedProps as HTMLMotionProps<"div">)}>{children}</motion.div>;
  }
}
