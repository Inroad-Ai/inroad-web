"use client";

import { useAnimate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef } from "react";

import type { Testimonial } from "@/lib/testimonials";

import { TestimonialCard } from "./TestimonialCard";

/** One vertical marquee column. It holds its cards twice and slides by half
 * its height, so the loop is seamless; the copy is hidden from assistive tech. */
export function TestimonialColumn({
  items,
  seconds,
  reverse = false,
  paused,
  still,
  className = "",
}: {
  items: readonly Testimonial[];
  seconds: number;
  reverse?: boolean;
  paused: boolean;
  still: boolean;
  className?: string;
}) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const controls = useRef<AnimationPlaybackControls | undefined>(undefined);

  useEffect(() => {
    if (still) return;
    controls.current = animate(
      scope.current,
      { y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] },
      { duration: seconds, ease: "linear", repeat: Infinity },
    );
    return () => controls.current?.stop();
  }, [animate, scope, seconds, reverse, still]);

  useEffect(() => {
    if (paused) controls.current?.pause();
    else controls.current?.play();
  }, [paused]);

  return (
    <div ref={scope} className={`min-w-0 flex-col gap-4 pb-4 ${className}`}>
      {items.map((t) => (
        <TestimonialCard key={t.name} testimonial={t} />
      ))}
      {still ? null : (
        <div aria-hidden className="contents">
          {items.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}
