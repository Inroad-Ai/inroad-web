"use client";

import { motion } from "framer-motion";

import { Avatar } from "@/components/ui/Avatar";
import { CheckIcon } from "@/components/ui/Icons";

import { CARD_VARIANTS, type ChapterState } from "./story-motion";

interface MarkProps {
  state: ChapterState;
  still?: boolean;
}

/** Chapter one: the profile everything starts from. `withDot` draws its own
 * glowing node for the stacked story, where no node field sits behind it. */
export function YouTag({
  state,
  still = false,
  withDot = false,
}: MarkProps & { withDot?: boolean }) {
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      className="grid justify-items-center gap-6"
    >
      {withDot ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-full bg-signal-amber shadow-amber ring-8 ring-signal-amber/15"
        />
      ) : null}
      <div className="flex items-center gap-3 rounded-full bg-surface py-2.5 pl-2.5 pr-4 text-sm font-sans-semibold text-ink shadow-card">
        <Avatar name="Jordan Reyes" size="sm" />
        <span>
          Jordan Reyes
          <small className="block text-xs font-sans-medium text-ink-muted">
            Backend Engineer · Berlin
          </small>
        </span>
      </div>
    </motion.div>
  );
}

/** Chapter six: the note went out, from the visitor's own inbox. */
export function SentVisual({ state, still = false }: MarkProps) {
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial={still ? false : "upcoming"}
      animate={still ? "active" : state}
      className="grid justify-items-center gap-8 text-center"
    >
      <span className="grid h-20 w-20 place-items-center rounded-full bg-signal-teal text-paper ring-8 ring-signal-teal/15 shadow-pop">
        <CheckIcon className="h-9 w-9" />
      </span>
      <div className="rounded-full bg-surface px-5 py-3 text-sm font-sans-semibold text-ink shadow-card">
        Sent from jordan.reyes@hey.com
        <small className="block text-xs font-sans-medium text-ink-muted">
          via Gmail · Tuesday 09:41
        </small>
      </div>
    </motion.div>
  );
}
