"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { useLandingMotion } from "@/lib/landing-motion";

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path d="M3 8.5 6.2 11.5 13 4.5" stroke="rgb(var(--color-signal-teal))" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A domain being typed into a research bar, with a signal pinging out
 * underneath it, standing in for a search kicking off. */
function PingVisual() {
  const reduceMotion = useLandingMotion();
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2.5 shadow-card">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="font-mono text-xs text-ink">stripe.com</span>
        <motion.span
          aria-hidden
          className="h-3 w-px bg-ink/50"
          animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <svg viewBox="0 0 200 160" className="h-32 w-44 sm:h-36 sm:w-52">
        {[0, 0.9, 1.8].map((delay) => (
          <motion.circle
            key={delay}
            cx={100}
            cy={70}
            r={16}
            fill="none"
            stroke="rgb(var(--color-signal-amber))"
            strokeWidth={1.5}
            style={{ transformOrigin: "100px 70px" }}
            initial={{ opacity: 0.55, scale: 1 }}
            animate={reduceMotion ? undefined : { opacity: [0.55, 0], scale: [1, 3.2] }}
            transition={{ duration: 2.7, repeat: Infinity, ease: "easeOut", delay }}
          />
        ))}
        {[
          { x: 46, y: 40, delay: 0.2 },
          { x: 154, y: 46, delay: 0.7 },
          { x: 44, y: 108, delay: 1.2 },
          { x: 156, y: 112, delay: 0.5 },
        ].map((dot) => (
          <motion.circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={2.5}
            fill="rgb(var(--color-signal-amber))"
            initial={{ opacity: 0.2 }}
            animate={reduceMotion ? undefined : { opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
        <circle cx={100} cy={70} r={6} fill="rgb(var(--color-signal-amber))" />
      </svg>
    </div>
  );
}

/** Loose points of varying weight drifting inward to one center and back
 * out, standing in for scattered context settling into a single brief. */
function ConvergeVisual() {
  const reduceMotion = useLandingMotion();
  const nodes = [
    { x: 40, y: 44, r: 4.5, delay: 0 },
    { x: 160, y: 50, r: 3, delay: 0.18 },
    { x: 46, y: 154, r: 3.5, delay: 0.36 },
    { x: 156, y: 148, r: 5, delay: 0.54 },
    { x: 100, y: 26, r: 3, delay: 0.72 },
    { x: 100, y: 174, r: 4, delay: 0.9 },
  ];
  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40 sm:h-48 sm:w-48">
      <circle cx={100} cy={100} r={86} fill="none" stroke="rgb(var(--color-line))" strokeWidth={1} strokeDasharray="3 6" />
      <motion.circle
        cx={100}
        cy={100}
        r={26}
        fill="rgb(var(--color-signal-teal))"
        initial={{ opacity: 0.08 }}
        animate={reduceMotion ? undefined : { opacity: [0.08, 0.18, 0.08], r: [26, 32, 26] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {nodes.map((node) => (
        <motion.line
          key={`line-${node.x}-${node.y}`}
          x1={node.x}
          y1={node.y}
          x2={100}
          y2={100}
          stroke="rgb(var(--color-signal-teal))"
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0, 0.4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
        />
      ))}
      {nodes.map((node) => (
        <motion.circle
          key={`node-${node.x}-${node.y}`}
          r={node.r}
          fill="rgb(var(--color-signal-teal))"
          initial={{ cx: node.x, cy: node.y, opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : { cx: [node.x, 100, node.x], cy: [node.y, 100, node.y], opacity: [0, 1, 0] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
        />
      ))}
      <circle cx={100} cy={100} r={7} fill="rgb(var(--color-signal-teal))" />
    </svg>
  );
}

/** An editor card with a line-number gutter, each line drawing itself out
 * at reading width, standing in for a draft being written from what came
 * before. */
function WriteVisual() {
  const reduceMotion = useLandingMotion();
  const lines = [0.92, 0.68, 0.8, 0.5];
  return (
    <div className="w-52 rounded-2xl border border-line bg-surface p-5 shadow-card sm:w-60">
      <div className="flex items-center gap-1.5 pb-4">
        <span className="h-2 w-2 rounded-full bg-muted-rose/45" />
        <span className="h-2 w-2 rounded-full bg-signal-amber/45" />
        <span className="h-2 w-2 rounded-full bg-success/45" />
      </div>
      <div className="flex flex-col gap-3.5">
        {lines.map((width, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <span className="w-3 shrink-0 text-right font-mono text-[10px] text-text-secondary/50">{index + 1}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line/60">
              <motion.div
                className={`h-full rounded-full ${index === lines.length - 1 ? "bg-signal-amber" : "bg-ink/25"}`}
                style={{ transformOrigin: "left center", width: `${width * 100}%` }}
                initial={{ scaleX: 0 }}
                animate={reduceMotion ? { scaleX: 1 } : { scaleX: [0, 1, 1, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.32 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Step = {
  number: string;
  title: string;
  copy: string;
  bullets: string[];
  tag: string;
  visual: ReactNode;
  overlay: { eyebrow: string; label: string; value: string };
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Start with a company you are curious about.",
    copy: "Drop in a domain. Inroad gives the research a single, reusable home instead of another loose tab.",
    bullets: ["One domain, one dossier", "No manual tab-juggling", "Reusable for every outreach draft"],
    tag: "stripe.com",
    visual: <PingVisual />,
    overlay: { eyebrow: "Live", label: "Research started", value: "stripe.com" },
  },
  {
    number: "02",
    title: "Let the useful context come together.",
    copy: "Homepage, recent news, and hiring signals are checked at the same time. You see what came back and where it came from.",
    bullets: ["Homepage, news, and hiring in parallel", "Every fact links back to its source", "Nothing goes in the draft unverified"],
    tag: "3 sources checked",
    visual: <ConvergeVisual />,
    overlay: { eyebrow: "3/3", label: "Sources checked", value: "Homepage · News · Hiring" },
  },
  {
    number: "03",
    title: "Write from evidence, then make it yours.",
    copy: "Use the dossier to build a message worth sending. You edit it, decide on it, and send it yourself.",
    bullets: ["Draft grounded in the dossier, not a template", "You edit every line before it sends", "Nothing goes out without your review"],
    tag: "Always your call",
    visual: <WriteVisual />,
    overlay: { eyebrow: "Ready", label: "Draft grounded in evidence", value: "Always your call" },
  },
];

function CardFace({ step, imageFirst }: { step: Step; imageFirst: boolean }) {
  return (
    <div className="grid w-full overflow-hidden rounded-3xl border border-line bg-surface shadow-card md:grid-cols-2">
      <div className={`${imageFirst ? "md:order-1" : "md:order-2"} relative flex aspect-[4/3] w-full items-center justify-center bg-surface-raised md:aspect-auto`}>
        {step.visual}
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border border-line bg-surface/95 px-4 py-3 shadow-card backdrop-blur sm:inset-x-5 sm:bottom-5">
          <span className="shrink-0 rounded-full bg-signal-teal-subtle px-2.5 py-1 text-[11px] font-semibold text-signal-teal">
            {step.overlay.eyebrow}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-ink">{step.overlay.label}</p>
            <p className="truncate text-[11px] text-text-secondary">{step.overlay.value}</p>
          </div>
        </div>
      </div>
      <div className={`${imageFirst ? "md:order-2" : "md:order-1"} flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-12`}>
        <div className="flex items-center gap-3">
          <span className="utility-label text-signal-teal">Step {step.number}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{step.copy}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {step.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2.5 text-sm text-ink">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle">
                <CheckMark />
              </span>
              {bullet}
            </li>
          ))}
        </ul>
        <span className="mt-8 inline-flex w-fit rounded-full bg-surface-raised px-3 py-2 font-mono text-xs text-ink">
          {step.tag}
        </span>
      </div>
    </div>
  );
}

/** Fractions of the whole pinned scroll sequence (0..1). Card 1 arrives and
 * covers card 0, then card 2 arrives and covers card 1, each with a hold
 * before and after so the top card can be read. There is no separate exit
 * animation: scrolling back up runs this same scroll-driven transform in
 * reverse, so the stack un-piles itself the same way it piled up. */
const ENTER_1: [number, number] = [0.12, 0.34];
const ENTER_2: [number, number] = [0.5, 0.72];

const TRAVEL_PX = 700;
const PEEK_PX = 24;
const RECEDE_SCALE = 0.94;

function StackedSequence() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useLandingMotion();
  const { scrollYProgress: rawProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 260, damping: 40, mass: 0.4 });

  const scale0 = useTransform(scrollYProgress, [0, ENTER_1[0], ENTER_1[1], 1], [1, 1, RECEDE_SCALE, RECEDE_SCALE]);

  const y1 = useTransform(
    scrollYProgress,
    [0, ENTER_1[0], ENTER_1[1], 1],
    [TRAVEL_PX + PEEK_PX, TRAVEL_PX + PEEK_PX, PEEK_PX, PEEK_PX]
  );
  const opacity1 = useTransform(scrollYProgress, [0, ENTER_1[0], ENTER_1[1], 1], [0, 0, 1, 1]);
  const scale1 = useTransform(scrollYProgress, [0, ENTER_2[0], ENTER_2[1], 1], [1, 1, RECEDE_SCALE, RECEDE_SCALE]);

  const y2 = useTransform(
    scrollYProgress,
    [0, ENTER_2[0], ENTER_2[1], 1],
    [TRAVEL_PX + PEEK_PX * 2, TRAVEL_PX + PEEK_PX * 2, PEEK_PX * 2, PEEK_PX * 2]
  );
  const opacity2 = useTransform(scrollYProgress, [0, ENTER_2[0], ENTER_2[1], 1], [0, 0, 1, 1]);

  if (reduceMotion) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6">
        {STEPS.map((step, index) => (
          <CardFace key={step.number} step={step} imageFirst={index % 2 === 0} />
        ))}
      </div>
    );
  }

  const cards = [
    { step: STEPS[0], y: 0, opacity: 1, scale: scale0, zIndex: 1 },
    { step: STEPS[1], y: y1, opacity: opacity1, scale: scale1, zIndex: 2 },
    { step: STEPS[2], y: y2, opacity: opacity2, scale: 1, zIndex: 3 },
  ];

  return (
    <div ref={outerRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-16 flex h-[80vh] w-full items-center justify-center overflow-hidden px-6 sm:top-20">
        <div className="relative w-full max-w-5xl">
          {cards.map((card, index) => (
            <motion.div
              key={card.step.number}
              style={{ y: card.y, opacity: card.opacity, scale: card.scale, zIndex: card.zIndex }}
              className={index === 0 ? "relative" : "absolute inset-0"}
            >
              <CardFace step={card.step} imageFirst={index % 2 === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line">
      <div className="mx-auto max-w-2xl px-6 pt-20 text-center sm:pt-28">
        <Reveal offset={18} duration={0.56}>
          <span className="utility-label inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-text-secondary">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal-amber" />
            From curiosity to outreach
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            A calmer way <span className="text-signal-amber">to do the homework.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
            The work stays human. Inroad just removes the part that makes each good lead feel expensive.
          </p>
        </Reveal>
      </div>

      <div className="mt-6 sm:mt-8">
        <StackedSequence />
      </div>
    </section>
  );
}
