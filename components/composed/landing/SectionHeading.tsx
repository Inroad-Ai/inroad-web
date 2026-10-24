import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

import { RevealHeadline, type HeadlineLine } from "./RevealHeadline";

/** Kicker, display heading and an optional lede, opening a landing section. */
export function SectionHeading({
  kicker,
  lines,
  lede,
  align = "left",
  dot = false,
}: {
  kicker: string;
  lines: readonly HeadlineLine[];
  lede?: ReactNode;
  align?: "left" | "center";
  dot?: boolean;
}) {
  const centered = align === "center";
  return (
    <div
      className={`mb-10 grid max-w-3xl gap-4 md:mb-14 md:gap-5 ${
        centered ? "mx-auto justify-items-center text-center" : ""
      }`}
    >
      <Reveal>
        <Eyebrow dot={dot ? "static" : undefined}>{kicker}</Eyebrow>
      </Reveal>
      <RevealHeadline lines={lines} className="text-section text-ink" />
      {lede ? (
        <Reveal as="p" delay={0.1} className="max-w-xl text-lg text-ink-muted">
          {lede}
        </Reveal>
      ) : null}
    </div>
  );
}
