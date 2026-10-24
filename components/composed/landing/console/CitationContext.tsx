"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { DemoSource } from "@/lib/landing/ask-types";

import { CitationPopover } from "./CitationPopover";

const CLOSE_DELAY_MS = 160;
export const CITATION_POPOVER_ID = "ask-citation-popover";

export interface OpenCitation {
  key: string;
  source: DemoSource;
  anchor: HTMLElement;
}

interface CitationControls {
  openKey: string | null;
  open: (citation: OpenCitation) => void;
  toggle: (citation: OpenCitation) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
}

const CitationContext = createContext<CitationControls | null>(null);

export function useCitations(): CitationControls {
  const controls = useContext(CitationContext);
  if (!controls) throw new Error("useCitations must be used inside CitationProvider");
  return controls;
}

/** One popover for every citation chip in the console: hover, focus or tap a
 * chip to read the quote and where it came from. */
export function CitationProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<OpenCitation | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const closeNow = useCallback(() => {
    cancelClose();
    setCurrent(null);
  }, [cancelClose]);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setCurrent(null), CLOSE_DELAY_MS);
  }, [cancelClose]);
  const open = useCallback(
    (citation: OpenCitation) => {
      cancelClose();
      setCurrent(citation);
    },
    [cancelClose],
  );
  const toggle = useCallback(
    (citation: OpenCitation) =>
      setCurrent((prev) => (prev?.key === citation.key ? null : citation)),
    [],
  );

  useEffect(() => {
    if (!current) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(`#${CITATION_POPOVER_ID}, [data-citation]`)) return;
      closeNow();
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeNow();
    window.addEventListener("scroll", closeNow, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", closeNow);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [current, closeNow]);

  useEffect(() => cancelClose, [cancelClose]);

  const controls = useMemo(
    () => ({ openKey: current?.key ?? null, open, toggle, scheduleClose, cancelClose }),
    [current, open, toggle, scheduleClose, cancelClose],
  );

  return (
    <CitationContext.Provider value={controls}>
      {children}
      <CitationPopover
        citation={current}
        onPointerEnter={cancelClose}
        onPointerLeave={scheduleClose}
      />
    </CitationContext.Provider>
  );
}
