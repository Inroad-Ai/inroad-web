"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GlobeIcon, LinkIcon } from "@/components/ui/Icons";

import { CITATION_POPOVER_ID, type OpenCitation } from "./CitationContext";

const GAP = 10;
const VIEWPORT_MARGIN = 12;

/** Rendered into <body> with fixed positioning so a transformed ancestor (the
 * hero's reveal animation) can't offset it. */
export function CitationPopover({
  citation,
  onPointerEnter,
  onPointerLeave,
}: {
  citation: OpenCitation | null;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ key: string; left: number; top: number } | null>(null);

  useEffect(() => {
    const popover = ref.current;
    if (!citation || !popover) {
      setPosition(null);
      return;
    }
    const anchor = citation.anchor.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = popover;
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, anchor.left + anchor.width / 2 - width / 2),
      window.innerWidth - width - VIEWPORT_MARGIN,
    );
    const above = anchor.top - height - GAP;
    setPosition({ key: citation.key, left, top: above < GAP ? anchor.bottom + GAP : above });
  }, [citation]);

  if (!citation || typeof document === "undefined") return null;
  const { source } = citation;
  const placed = position?.key === citation.key ? position : null;

  return createPortal(
    <div
      ref={ref}
      id={CITATION_POPOVER_ID}
      role="tooltip"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={placed ? { left: placed.left, top: placed.top } : undefined}
      className={`fixed left-0 top-0 z-50 w-80 max-w-popover rounded-card bg-surface px-4 pb-3 pt-3.5 text-left font-sans shadow-pop transition-opacity duration-fast ${
        placed ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <p className="utility-label flex items-center gap-2 text-ink-muted">
        <GlobeIcon className="h-3.5 w-3.5" />
        {source.label}
      </p>
      <p className="my-2.5 border-l-2 border-signal-amber pl-3 text-sm text-ink">{source.quote}</p>
      <p className="flex items-center gap-1.5 break-all font-mono text-2xs text-signal-teal">
        <LinkIcon className="h-3 w-3" />
        {source.url.replace(/^https?:\/\//, "")}
      </p>
    </div>,
    document.body,
  );
}
