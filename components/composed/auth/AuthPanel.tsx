"use client";

import { useRef } from "react";

import { NodeField, type NodeFieldMask } from "@/components/ui/NodeField";
import { useLandingMotion } from "@/lib/landing-motion";

import { AuthEventStack } from "./AuthEventStack";
import { AuthQuote } from "./AuthQuote";

const FIELD_CENTER = { x: 0.5, y: 0.28 };
const FIELD_SEED = 5;

/** The right half of every auth screen: the ambient node field, a live-looking
 * stack of events and a rotating testimonial, with the field masked out under both. */
export function AuthPanel() {
  const isStill = useLandingMotion();
  const eventsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const masks: NodeFieldMask[] = [{ target: eventsRef }, { target: quoteRef, radius: 4 }];

  return (
    <div className="relative isolate flex h-full flex-col overflow-hidden rounded-card bg-panel shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 left-1/2 h-3/4 w-full -translate-x-1/2 bg-glow-amber opacity-40"
      />
      <NodeField mode="ambient" center={FIELD_CENTER} seed={FIELD_SEED} masks={masks} />
      <div className="relative flex flex-1 items-center justify-center px-10 pt-24">
        <div ref={eventsRef} className="w-full max-w-sm">
          <AuthEventStack isStill={isStill} />
        </div>
      </div>
      <div ref={quoteRef} className="relative px-11 pb-10">
        <AuthQuote isStill={isStill} />
      </div>
    </div>
  );
}
