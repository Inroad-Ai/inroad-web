"use client";

import { useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SECTION_IDS } from "@/lib/landing/sections";
import { useLandingMotion } from "@/lib/landing-motion";
import { WALL_TESTIMONIALS } from "@/lib/testimonials";

import { LandingSection } from "./LandingSection";
import { SectionHeading } from "./SectionHeading";
import { TestimonialColumn } from "./TestimonialColumn";

const COLUMNS = [0, 1, 2].map((c) => WALL_TESTIMONIALS.filter((_, i) => i % 3 === c));
const COLUMN_SECONDS = [46, 58, 52];
const SINGLE_COLUMN_SECONDS = 96;
const COLUMN_VISIBILITY = ["hidden md:flex", "hidden md:flex", "hidden lg:flex"];

/** The early-access wall: three slow columns, two on tablets and one on
 * phones. Hovering pauses it; reduced motion lays the cards out still. */
export function Testimonials() {
  const reduceMotion = useLandingMotion();
  const [paused, setPaused] = useState(false);

  return (
    <LandingSection id={SECTION_IDS.stories}>
      <SectionHeading
        align="center"
        dot
        kicker="From early access"
        lines={[{ text: "They stopped applying." }, { text: "They started writing.", muted: true }]}
      />
      <Reveal
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className={
          reduceMotion
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "grid h-wall gap-4 overflow-hidden mask-fade-y md:grid-cols-2 lg:grid-cols-3"
        }
      >
        {reduceMotion ? (
          COLUMNS.map((items, i) => (
            <TestimonialColumn key={i} items={items} seconds={0} paused still className="flex" />
          ))
        ) : (
          <>
            <TestimonialColumn
              items={WALL_TESTIMONIALS}
              seconds={SINGLE_COLUMN_SECONDS}
              paused={paused}
              still={false}
              className="flex md:hidden"
            />
            {COLUMNS.map((items, i) => (
              <TestimonialColumn
                key={i}
                items={items}
                seconds={COLUMN_SECONDS[i]}
                reverse={i === 1}
                paused={paused}
                still={false}
                className={COLUMN_VISIBILITY[i]}
              />
            ))}
          </>
        )}
      </Reveal>
    </LandingSection>
  );
}
