"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { PlusIcon } from "@/components/ui/Icons";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";
import { FAQ } from "@/lib/landing/landing-copy";
import { SECTION_IDS } from "@/lib/landing/sections";

import { LandingSection } from "./LandingSection";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const reduceMotion = useLandingMotion();

  return (
    <LandingSection id={SECTION_IDS.faq}>
      <SectionHeading align="center" kicker="FAQ" lines={[{ text: "Fair questions." }]} />
      <div className="mx-auto grid max-w-3xl gap-2.5">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          return (
            <Card
              key={item.q}
              padding="none"
              className="overflow-hidden transition-shadow duration-fast hover:shadow-card-hover"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 rounded-card px-5 py-5 text-left text-lg font-sans-semibold tracking-heading text-ink md:px-6 md:text-xl"
                >
                  {item.q}
                  <span
                    aria-hidden
                    className={`ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border transition duration-base ${
                      isOpen
                        ? "rotate-45 border-signal-amber bg-signal-amber text-on-amber"
                        : "border-ink/20 text-ink"
                    }`}
                  >
                    <PlusIcon />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={{ height: "auto" }}
                    exit={reduceMotion ? { height: 0, transition: { duration: 0 } } : { height: 0 }}
                    transition={{ duration: 0.4, ease: LANDING_EASE }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl px-5 pb-5 text-base text-ink-muted md:px-6">{item.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
