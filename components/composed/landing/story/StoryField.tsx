"use client";

import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";

import { NodeField, type NodeFieldNode } from "@/components/ui/NodeField";
import { FIT_COUNT } from "@/lib/landing/story-chapters";

const FIT_NODES: readonly NodeFieldNode[] = Array.from({ length: FIT_COUNT }, (_, i) => ({
  label: i === 0 ? "Ledgerline" : "",
}));
// Progress steps small enough to look continuous, coarse enough to skip
// re-rendering on scroll events that wouldn't move a pixel.
const PROGRESS_STEPS = 400;

const quantize = (value: number) => Math.round(value * PROGRESS_STEPS) / PROGRESS_STEPS;

/** The node field behind the pinned story, gathering and filtering as the
 * visitor scrolls through chapter two. */
export function StoryField({
  progress,
  opacity,
  center,
}: {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  center: { x: number; y: number };
}) {
  const [value, setValue] = useState(() => quantize(progress.get()));
  useMotionValueEvent(progress, "change", (next) => setValue(quantize(next)));

  return (
    <motion.div aria-hidden style={{ opacity }} className="absolute inset-0">
      <NodeField mode="story" progress={value} nodes={FIT_NODES} center={center} />
    </motion.div>
  );
}
