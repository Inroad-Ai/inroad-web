import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { SECTION_IDS } from "@/lib/landing/sections";

import { LandingSection } from "../LandingSection";
import { SectionHeading } from "../SectionHeading";

import { BoardMini } from "./BoardMini";
import { CadenceMini } from "./CadenceMini";
import { FactMini } from "./FactMini";
import { FitMini } from "./FitMini";
import { ResearchMini } from "./ResearchMini";
import { ToneMini } from "./ToneMini";

const FEATURES: readonly { title: string; body: string; span: string; mini: ReactNode }[] = [
  {
    title: "Research in parallel",
    body: "Paste a domain. Homepage, news and hiring are read at the same time, in about three seconds.",
    span: "sm:col-span-3",
    mini: <ResearchMini />,
  },
  {
    title: "A fit score you can read",
    body: "No black box. Four reasons, each in plain words, each something you told us you care about.",
    span: "sm:col-span-3",
    mini: <FitMini />,
  },
  {
    title: "Your tone, one tap",
    body: "Warmer, shorter, more specific, more formal. Your words stay yours.",
    span: "sm:col-span-3 lg:col-span-2",
    mini: <ToneMini />,
  },
  {
    title: "Every fact has a source",
    body: "If Inroad can't point to where it read something, it doesn't go in your draft.",
    span: "sm:col-span-3 lg:col-span-2",
    mini: <FactMini />,
  },
  {
    title: "A pipeline that moves",
    body: "Drag companies between stages, or let replies move them for you.",
    span: "sm:col-span-6 lg:col-span-2",
    mini: <BoardMini />,
  },
  {
    title: "Follow-ups that know when to stop",
    body: "Pick a cadence once. Inroad drafts each follow-up for you to approve, and the sequence ends the moment they write back.",
    span: "sm:col-span-6",
    mini: <CadenceMini />,
  },
];

export function Features() {
  return (
    <LandingSection id={SECTION_IDS.features}>
      <SectionHeading
        kicker="Inside the product"
        lines={[{ text: "Everything you'd do by hand, done properly." }]}
        lede="Small working versions of the screens you'll use, running on sample data."
      />
      <div className="grid gap-4 sm:grid-cols-6 md:gap-5">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            as="article"
            className={`flex flex-col gap-5 overflow-hidden ${feature.span}`}
          >
            <div>
              <h3 className="text-2xl font-sans-semibold leading-tight tracking-heading text-ink">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-muted">{feature.body}</p>
            </div>
            <Card variant="nested" padding="sm" className="mt-auto">
              {feature.mini}
            </Card>
          </Card>
        ))}
      </div>
    </LandingSection>
  );
}
