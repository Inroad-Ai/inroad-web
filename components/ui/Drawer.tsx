"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useRestoreFocus } from "@/hooks/useRestoreFocus";

/**
 * Backdrop + panel pinned to one edge. Same close behaviour as Modal
 * (Escape, backdrop click), and it renders nothing while closed so a closed
 * drawer never traps tab order. Modal is a centred dialog, which is the
 * wrong shape for navigation or for editing beside the page. `side="right"`
 * is the wide editing panel; the default is the narrow navigation drawer.
 */
export function Drawer({
  open,
  onClose,
  label,
  side = "left",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "left" | "right";
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEscapeKey(open, onClose);
  useBodyScrollLock(open);
  useRestoreFocus(open);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const right = side === "right";

  return (
    <div
      className={`fixed inset-0 z-50 bg-scrim/50 ${right ? "flex justify-end" : ""}`}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={
          right
            ? "h-full w-full max-w-panel animate-slide-in-right rounded-l-card bg-surface shadow-pop outline-none"
            : "h-full w-72 max-w-drawer animate-slide-in-left rounded-r-card bg-surface shadow-pop outline-none"
        }
      >
        {children}
      </div>
    </div>
  );
}
