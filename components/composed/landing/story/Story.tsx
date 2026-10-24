"use client";

import { SECTION_IDS } from "@/lib/landing/sections";
import { useLandingMotion } from "@/lib/landing-motion";

import { PinnedStory } from "./PinnedStory";
import { StaticStory } from "./StaticStory";

/** "The story of one email": six pinned chapters, or stacked and still when
 * the visitor prefers reduced motion. */
export function Story() {
  const reduceMotion = useLandingMotion();
  return (
    <>
      {reduceMotion ? <StaticStory /> : <PinnedStory />}
      <div id={SECTION_IDS.afterStory} />
    </>
  );
}
