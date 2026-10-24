"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { NodeField, type NodeFieldMask, type NodeFieldNode } from "@/components/ui/NodeField";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

import { LaunchStatusCard } from "./LaunchStatusCard";
import { useFirstMatchScan, type FirstMatchScan } from "./useFirstMatchScan";

const REVEAL_STEP_MS = 650;
const AUTO_CONTINUE_MS = 4000;
const FIELD_CENTER = { x: 0.5, y: 0.64 };
const FIELD_SEED = 3;
const TEXT_MASK_RADIUS = 30;
const PROFILE_NODE_LABEL = "Your profile";
// Matches are saved companies, so they open there; Research only lists runs started on it.
const MATCHES_PATH = "/companies";
const RESEARCH_PATH = "/research";

function launchSubline(role: string, city: string): string {
  if (!role) return "Scanning companies that fit your profile.";
  const article = /^[aeiou]/i.test(role) ? "an" : "a";
  return `Scanning companies that fit ${article} ${role}${city ? ` in ${city}` : ""}.`;
}

/** Named nodes for the field: the matches once they arrive, otherwise the role being searched. */
function fieldNodes(scan: FirstMatchScan, role: string, revealed: number) {
  if (scan.status === "matched" && scan.companies.length > 0) {
    const nodes: NodeFieldNode[] = scan.companies.map((company) => ({ label: company.domain }));
    return { nodes, activeIndex: revealed };
  }
  const isScanning = scan.status === "searching" || scan.status === "timedOut";
  return { nodes: [{ label: role || PROFILE_NODE_LABEL }], activeIndex: isScanning ? 0 : -1 };
}

/** The first run after setup: the real match scan, shown on the node field
 * until it settles, then on to the matches, or Research when there are none. */
export function LaunchScreen({ role, city }: { role: string; city: string }) {
  const router = useRouter();
  const isStill = useLandingMotion();
  const scan = useFirstMatchScan();
  const [revealed, setRevealed] = useState(0);
  const matchCount = scan.status === "matched" ? scan.companies.length : 0;
  const isSettled = scan.status !== "searching" && revealed >= matchCount;
  const hasMatches = scan.status === "matched";
  const continuePath = hasMatches ? MATCHES_PATH : RESEARCH_PATH;

  const headRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const masks: NodeFieldMask[] = [
    { target: headRef, radius: TEXT_MASK_RADIUS },
    { target: cardRef },
    { target: footRef, radius: TEXT_MASK_RADIUS },
  ];

  useEffect(() => {
    if (revealed >= matchCount) return;
    const timer = window.setTimeout(
      () => setRevealed((value) => value + 1),
      isStill ? 0 : REVEAL_STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [revealed, matchCount, isStill]);

  useEffect(() => {
    if (!isSettled) return;
    const timer = window.setTimeout(() => router.push(continuePath), AUTO_CONTINUE_MS);
    return () => window.clearTimeout(timer);
  }, [isSettled, continuePath, router]);

  const rise = (delay: number) => ({
    initial: isStill ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: LANDING_EASE, delay },
  });

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-2/3 w-full -translate-x-1/2 bg-glow-amber opacity-30"
      />
      <NodeField
        mode="research"
        {...fieldNodes(scan, role, revealed)}
        center={FIELD_CENTER}
        seed={FIELD_SEED}
        masks={masks}
      />

      <header className="relative z-10 flex items-center justify-between gap-4 px-page py-5">
        <Link href="/" aria-label="Inroad home" className="rounded-nest">
          <Logo variant="mark" />
        </Link>
        <ThemeControl compact />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-page pb-12 pt-2 text-center">
        <motion.div ref={headRef} className="flex max-w-2xl flex-col items-center" {...rise(0)}>
          <Eyebrow dot={isSettled ? "static" : "live"}>First run</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-title font-sans-semibold tracking-display text-ink">
            Researching your first matches
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-muted sm:text-lg">
            {launchSubline(role, city)}
          </p>
        </motion.div>

        <motion.div ref={cardRef} className="mt-9 w-full max-w-xl" {...rise(0.1)}>
          <LaunchStatusCard scan={scan} revealed={revealed} />
        </motion.div>

        <div ref={footRef} className="mt-7 flex min-h-12 flex-col items-center gap-2">
          {isSettled ? (
            <>
              <Button href={continuePath} size="lg" icon={<ArrowRightIcon />} iconPosition="end">
                {hasMatches ? "Open your matches" : "Go to Research"}
              </Button>
              <span className="utility-label text-ink-faint">Opening automatically</span>
            </>
          ) : (
            <Button href={RESEARCH_PATH} variant="ghost">
              Skip to Research
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
