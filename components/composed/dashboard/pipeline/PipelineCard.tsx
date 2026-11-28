"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { companyDisplayName } from "@/lib/company-brief";
import { LANDING_EASE_STANDARD } from "@/lib/landing-motion";
import type { Company } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Notice } from "@/components/ui/Notice";
import type { PipelineStage } from "@/components/ui/StatusBadge";

import { StageMenu } from "../companies/StageMenu";
import { Ic, Lm } from "../v2/kit";
import { boardNote, isQuiet, nextStepHint, nextStepHref } from "../v2/next-step";
import { sampleFit } from "../v2/sample";

// Seconds; the same as --motion-duration-base.
const MOVE_TRANSITION = { duration: 0.36, ease: LANDING_EASE_STANDARD };

function tintOf(domain: string): number {
  let sum = 0;
  for (const char of domain) sum += char.charCodeAt(0);
  return (sum % 6) + 1;
}

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
  const name = companyDisplayName(company);
  const fit = sampleFit(company.id);
  const quiet = isQuiet(company);

  // framer-motion claims the onDrag* props for its own gesture, so the native
  // drag handlers live on the inner card, not on the motion element.
  return (
    <motion.li
      layout={!reduceMotion}
      layoutId={reduceMotion ? undefined : company.id}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOVE_TRANSITION}
    >
      <div
        className="stage-card"
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
          if (e.key === "Enter" && e.target === e.currentTarget) onOpen();
        }}
        style={{ opacity: dragging ? 0.4 : moving ? 0.7 : 1 }}
      >
        <div className="row">
          {company.logo_url ? (
            <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="sm" />
          ) : (
            <Lm i={name.charAt(0).toUpperCase()} c={tintOf(company.domain)} size="xs" />
          )}
          <span className="m sm stage-name">{name}</span>
          <span className={`xs m ${fit > 85 ? "green" : "faint"}`} title="Sample fit score">
            {fit}
          </span>
        </div>

        <div className="row" style={{ marginTop: 7, gap: 6 }}>
          <Link
            href={nextStepHref(company)}
            onClick={(event) => event.stopPropagation()}
            onDragStart={(event) => event.preventDefault()}
            className={`xs ${quiet ? "rose" : "muted"}`}
            title={nextStepHint(company)}
            style={{ flex: 1, minWidth: 0 }}
          >
            {quiet ? <span aria-hidden className="quiet-dot" /> : null}
            {moving ? "Moving..." : boardNote(company)}
          </Link>
          {/* The keyboard and touch alternative to dragging. */}
          <span
            className="stage-move"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <StageMenu
              label={`Move ${company.domain} to another stage`}
              trigger={<Ic n="dots" size="s" />}
              current={company.stage}
              disabled={moving}
              onSelect={onMove}
            />
          </span>
        </div>

        {errorMessage ? <Notice size="xs">{errorMessage}</Notice> : null}
      </div>
    </motion.li>
  );
}
