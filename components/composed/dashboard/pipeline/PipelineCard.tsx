"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { describeHiring } from "@/lib/companies";
import { LANDING_EASE_STANDARD } from "@/lib/landing-motion";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import type { PipelineStage } from "@/components/ui/StatusBadge";
import { Notice } from "@/components/ui/Notice";

import { CompanyIdentity } from "../companies/CompanyIdentity";
import { Ic } from "../v2/kit";
import { NEXT_STEP, nextStepHint, nextStepHref } from "../v2/next-step";
import { sampleFit } from "../v2/sample";
import { StageMenu } from "../companies/StageMenu";

// Seconds; the same as --motion-duration-base.
const MOVE_TRANSITION = { duration: 0.36, ease: LANDING_EASE_STANDARD };

export function PipelineCard({
  company,
  moving,
  dragging,
  errorMessage,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  company: Company;
  moving: boolean;
  dragging: boolean;
  errorMessage?: string;
  onOpen: () => void;
  onMove: (to: PipelineStage) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const hiring = describeHiring(company);

  // framer-motion claims the onDrag* props for its own gesture, so the native
  // drag handlers live on the inner Card, not on the motion element.
  return (
    <motion.li
      layout={!reduceMotion}
      layoutId={reduceMotion ? undefined : company.id}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOVE_TRANSITION}
    >
      <Card
        variant="interactive"
        padding="none"
        role="button"
        tabIndex={0}
        aria-busy={moving}
        aria-label={`Open ${company.domain}`}
        draggable={!moving}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", company.id);
          e.dataTransfer.effectAllowed = "move";
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen();
        }}
        className={`flex cursor-grab flex-col gap-3 p-3.5 ring-1 ring-inset ring-line active:cursor-grabbing ${
          dragging ? "opacity-40" : moving ? "opacity-70" : ""
        }`}
      >
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CompanyIdentity company={company} size="sm" />
          </div>
          <span
            className={`xs m ${sampleFit(company.id) > 85 ? "green" : "faint"}`}
            title="Sample fit score"
          >
            {sampleFit(company.id)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-xs ${hiring.muted ? "text-ink-muted" : "font-sans-semibold text-signal-teal"}`}
          >
            {moving ? "Moving..." : hiring.label}
          </span>
          <StageMenu
            label={`Move ${company.domain} to another stage`}
            trigger="Move"
            current={company.stage}
            disabled={moving}
            onSelect={onMove}
          />
        </div>

        <Link
          href={nextStepHref(company)}
          onClick={(event) => event.stopPropagation()}
          onDragStart={(event) => event.preventDefault()}
          className="row xs muted"
          style={{ gap: 6 }}
          title={nextStepHint(company)}
        >
          {NEXT_STEP[company.stage]}
          <Ic n="arrow" size="xs" />
        </Link>

        {errorMessage ? <Notice size="xs">{errorMessage}</Notice> : null}
      </Card>
    </motion.li>
  );
}
