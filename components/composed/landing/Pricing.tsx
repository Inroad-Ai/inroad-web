"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/Icons";
import { Tabs } from "@/components/ui/Tabs";
import { useLandingMotion } from "@/lib/landing-motion";
import { PLANS, PRO_PRICE } from "@/lib/landing/landing-copy";
import { SECTION_IDS } from "@/lib/landing/sections";

import { LandingSection } from "./LandingSection";
import { SectionHeading } from "./SectionHeading";

type Billing = "monthly" | "yearly";
const BILLING_TABS = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-sm font-sans-semibold text-ink-muted"
        >
          <span className="mt-0.5 text-signal-teal">
            <CheckIcon />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Price({ amount, per }: { amount: number; per: string }) {
  const reduceMotion = useLandingMotion();
  return (
    <div className="flex items-baseline gap-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.b
          key={amount}
          className="font-display text-hero font-sans-semibold tabular-nums tracking-display text-ink"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          €{amount}
        </motion.b>
      </AnimatePresence>
      <span className="font-sans-semibold text-ink-muted">{per}</span>
    </div>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearly = billing === "yearly";

  return (
    <LandingSection id={SECTION_IDS.pricing}>
      <SectionHeading
        align="center"
        kicker="Pricing"
        lines={[{ text: "Free while we're in early access." }]}
        lede="Pro is what Inroad will cost later. Nobody is charged during early access, and you'll hear from us well before that changes."
      />
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
        <Tabs
          items={BILLING_TABS}
          activeId={billing}
          onChange={(id) => setBilling(id as Billing)}
        />
        <Badge tone="teal">2 months free yearly</Badge>
      </div>
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 md:gap-5">
        <Card as="article" padding="lg" className="flex flex-col gap-5">
          <h3 className="text-3xl font-sans-semibold tracking-heading text-ink">
            {PLANS.free.name}
          </h3>
          <Price amount={0} per="for now" />
          <p className="text-sm font-sans-semibold text-ink-muted">{PLANS.free.note}</p>
          <FeatureList items={PLANS.free.features} />
          <Button href="/signup" variant="quiet" size="lg" className="mt-auto w-full">
            Join early access
          </Button>
        </Card>
        <Card
          as="article"
          padding="lg"
          className="relative flex flex-col gap-5 overflow-hidden shadow-card-hover"
        >
          <div aria-hidden className="absolute inset-0 bg-signal-amber/5" />
          <h3 className="relative text-3xl font-sans-semibold tracking-heading text-ink">
            {PLANS.pro.name}
          </h3>
          <div className="relative">
            <Price amount={yearly ? PRO_PRICE.yearlyPerMonth : PRO_PRICE.monthly} per="per month" />
          </div>
          <p className="relative text-sm font-sans-semibold text-ink-muted">
            {yearly
              ? `Billed €${PRO_PRICE.yearlyTotal} a year, after early access.`
              : "After early access. Cancel any time."}
          </p>
          <div className="relative">
            <FeatureList items={PLANS.pro.features} />
          </div>
          <Button href="/signup" size="lg" className="relative mt-auto w-full">
            Start free, upgrade later
          </Button>
        </Card>
      </div>
    </LandingSection>
  );
}
