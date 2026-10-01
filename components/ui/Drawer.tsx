"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useRestoreFocus } from "@/hooks/useRestoreFocus";

/**
 * Backdrop + panel pinned to the left edge. Same close behaviour as Modal
 * (Escape, backdrop click), and it renders nothing while closed so a closed
 * drawer never traps tab order. Modal is a centred dialog, which is the
 * wrong shape for navigation.
 */
export function Drawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
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

  return (
    <div className="fixed inset-0 z-50 bg-scrim/40" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="h-full w-64 max-w-[85vw] border-r border-line bg-surface shadow-overlay outline-none"
      >
        {children}
      </div>
    </div>
  );
}
