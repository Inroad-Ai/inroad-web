"use client";

import { useId } from "react";

import type { DemoSource } from "@/lib/landing/ask-types";

import { CITATION_POPOVER_ID, useCitations } from "./CitationContext";

/** A numbered source chip inside an answer. */
export function CitationChip({ number, source }: { number: number; source: DemoSource }) {
  const key = useId();
  const { openKey, open, toggle, scheduleClose } = useCitations();
  const isOpen = openKey === key;

  return (
    <button
      type="button"
      data-citation
      aria-expanded={isOpen}
      aria-describedby={isOpen ? CITATION_POPOVER_ID : undefined}
      aria-label={`Source ${number}: ${source.label}`}
      onPointerEnter={(e) =>
        e.pointerType === "mouse" && open({ key, source, anchor: e.currentTarget })
      }
      onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
      onFocus={(e) =>
        e.currentTarget.matches(":focus-visible") && open({ key, source, anchor: e.currentTarget })
      }
      onBlur={scheduleClose}
      onClick={(e) => toggle({ key, source, anchor: e.currentTarget })}
      className={`relative z-10 mx-0.5 inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-full border border-signal-teal/30 pl-0.5 pr-2 align-middle font-mono text-2xs leading-none transition-colors duration-fast ${
        isOpen
          ? "bg-signal-teal text-paper"
          : "bg-signal-teal-subtle text-signal-teal hover:bg-signal-teal hover:text-paper"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
          isOpen ? "bg-paper text-signal-teal" : "bg-signal-teal text-paper"
        }`}
      >
        {number}
      </span>
      {source.label}
    </button>
  );
}
