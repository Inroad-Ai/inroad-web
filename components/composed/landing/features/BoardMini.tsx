"use client";

import { LayoutGroup, motion } from "framer-motion";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DEMO_COMPANIES } from "@/lib/landing/ask-companies";
import type { DemoCompany } from "@/lib/landing/ask-types";
import { LANDING_EASE_STANDARD } from "@/lib/landing-motion";

import { useVisibleLoop } from "./useVisibleLoop";

const STAGES = ["Contacted", "Responded", "Interviewing"] as const;
const byId = (id: string) => DEMO_COMPANIES.find((c) => c.id === id)!;
const MOVER = byId("ledgerline");
const SETTLED = [
  { company: byId("fernway"), stage: 0 },
  { company: byId("tessellate"), stage: 1 },
  { company: byId("orrery"), stage: 2 },
];
const MOVER_PATH = [0, 1, 2] as const;
const HOP_MS = 2400;

function MiniCard({ company: { name, domain } }: { company: DemoCompany }) {
  return (
    <motion.div
      layout
      layoutId={name}
      transition={{ duration: 0.7, ease: LANDING_EASE_STANDARD }}
      className="flex min-w-0 flex-col items-start gap-1.5 rounded-sm bg-surface-raised px-2 py-2 text-xs font-sans-bold text-ink shadow-nest"
    >
      <CompanyLogo logoUrl={null} seed={domain} size="xs" />
      <span className="max-w-full">{name}</span>
    </motion.div>
  );
}

/** A small pipeline where one company moves on through the stages. */
export function BoardMini() {
  const { ref, step } = useVisibleLoop<HTMLDivElement>(HOP_MS);
  const moverStage = MOVER_PATH[step % MOVER_PATH.length];
  return (
    <LayoutGroup>
      <div ref={ref} className="grid grid-cols-3 gap-2">
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className="flex min-h-36 min-w-0 flex-col gap-1.5 rounded-sm bg-surface px-1.5 py-2 shadow-nest"
          >
            <span className="utility-label truncate px-0.5 pb-1 text-2xs text-ink-muted">
              {stage}
            </span>
            {i === moverStage ? <MiniCard company={MOVER} /> : null}
            {SETTLED.filter((s) => s.stage === i).map(({ company }) => (
              <MiniCard key={company.id} company={company} />
            ))}
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}
