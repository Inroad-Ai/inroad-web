import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/Icons";
import { HOW_STEPS } from "@/lib/landing/landing-copy";
import { SECTION_IDS } from "@/lib/landing/sections";

import { DraftVisual, FactsVisual, MatchesVisual } from "./HowVisuals";
import { LandingSection } from "./LandingSection";
import { SectionHeading } from "./SectionHeading";

const VISUALS = [MatchesVisual, FactsVisual, DraftVisual];
// Each card sticks a little lower than the last, so the stack shows its edges.
// Phones skip the stack: a card taller than the screen would stick with its
// lower half never scrolled into view.
const STICKY_TOPS = ["md:top-24", "md:top-28", "md:top-32"];

export function HowItWorks() {
  return (
    <LandingSection id={SECTION_IDS.how} className="!pt-10">
      <SectionHeading
        kicker="How it works"
        lines={[{ text: "Three steps. One of them is yours." }]}
        lede="Inroad does the finding and the reading. You do the part that matters: deciding who to write to, and pressing Send."
      />
      <div className="grid gap-6">
        {HOW_STEPS.map((step, i) => {
          const Visual = VISUALS[i];
          return (
            <Card
              key={step.title}
              as="article"
              padding="none"
              className={`grid items-center gap-6 p-6 md:sticky md:min-h-96 md:grid-cols-2 md:gap-10 md:p-11 ${STICKY_TOPS[i]}`}
            >
              <div>
                <span className="text-lg font-sans-semibold text-signal-amber">0{i + 1}</span>
                <h3 className="mb-4 mt-3.5 text-2xl font-sans-semibold leading-tight tracking-heading text-ink md:text-3xl lg:text-4xl">
                  {step.title}
                </h3>
                <ul className="grid gap-2.5">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 font-sans-semibold text-ink-muted"
                    >
                      <span className="mt-1 text-signal-teal">
                        <CheckIcon />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <Card variant="nested" padding="sm" className="grid min-h-60 content-center gap-2.5">
                <Visual />
              </Card>
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
