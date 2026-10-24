"use client";

import { motion } from "framer-motion";

import { CheckIcon, RouteIcon } from "@/components/ui/Icons";
import { SpinnerIcon } from "@/components/ui/Icons";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

import { AnswerChips } from "./AnswerChips";
import { ContactLines, SignalTimeline } from "./AnswerExtras";
import type { AiMessage as AiMessageData } from "./console.types";
import { DraftPanel } from "./DraftPanel";
import { FitCard } from "./FitCard";
import { SegmentText } from "./SegmentText";
import { SourceTable } from "./SourceTable";

function StatusLine({ message }: { message: AiMessageData }) {
  const { answer, phase } = message;
  if (phase === "thinking")
    return <span className="animate-shimmer text-ink-muted">{answer.thinkingLabel}</span>;
  if (phase === "scanning")
    return (
      <>
        <span className="text-signal-teal">
          <SpinnerIcon />
        </span>
        <span>{answer.scanLabel}</span>
        <span className="utility-label ml-1 text-ink-faint">{answer.rows.length} sources</span>
      </>
    );
  return (
    <>
      <span className="grid h-4 w-4 place-items-center rounded-full bg-signal-teal text-paper">
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      <span>{answer.doneLabel}</span>
    </>
  );
}

/** One console reply: status, the sources it read, then the sourced answer. */
export function AiMessage({
  message,
  onChip,
  onPickCompany,
  onApprove,
}: {
  message: AiMessageData;
  onChip: (index: number) => void;
  onPickCompany: (companyId: string, name: string) => void;
  onApprove: () => void;
}) {
  const reduceMotion = useLandingMotion();
  const { answer, phase } = message;
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: LANDING_EASE },
      };

  return (
    <div className="mb-5 flex items-start gap-3">
      <span
        aria-hidden
        className="relative mt-px grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-sm bg-ink text-paper after:absolute after:right-1 after:top-1 after:h-2 after:w-2 after:rounded-full after:bg-signal-amber"
      >
        <RouteIcon />
      </span>
      <div className="min-w-0 flex-1 text-sm text-ink-muted sm:text-base">
        <div className="flex min-h-7 items-center gap-2 text-sm font-sans-medium text-ink-muted">
          <StatusLine message={message} />
        </div>
        {phase !== "thinking" && answer.rows.length ? (
          <SourceTable rows={answer.rows} states={message.rows} />
        ) : null}
        {phase === "answered" ? (
          <motion.div {...reveal} className="space-y-2">
            {answer.title ? (
              <div className="mb-2.5 mt-3.5 flex flex-wrap items-baseline gap-2.5">
                <h4 className="text-lg font-sans-semibold tracking-heading text-ink">
                  {answer.title}
                </h4>
                <span className="utility-label rounded-full bg-signal-teal-subtle px-2 py-1 text-signal-teal">
                  Ranked by fit
                </span>
              </div>
            ) : null}
            {answer.paragraphs.map((segments, i) => (
              <SegmentText key={i} segments={segments} sources={answer.sources} />
            ))}
            {answer.cards ? (
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 xl:grid-cols-3">
                {answer.cards.map((card) => (
                  <FitCard
                    key={card.company.id}
                    card={card}
                    source={answer.sources[card.cite]}
                    picked={message.pickedCompany === card.company.id}
                    onPick={() => onPickCompany(card.company.id, card.company.name)}
                  />
                ))}
              </div>
            ) : null}
            {answer.contact ? <ContactLines contact={answer.contact} /> : null}
            {answer.timeline?.length ? (
              <SignalTimeline items={answer.timeline} sources={answer.sources} />
            ) : null}
            {answer.draft ? (
              <DraftPanel
                draft={answer.draft}
                sources={answer.sources}
                typedTokens={message.typedTokens}
                sent={message.sent}
                approveTarget={`approve-${message.id}`}
                onApprove={onApprove}
              />
            ) : null}
            <AnswerChips
              chips={answer.chips}
              active={message.activeChip}
              targetPrefix={`chip-${message.id}`}
              onPress={onChip}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
