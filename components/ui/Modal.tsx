"use client";

import { useEffect, useId, type ReactNode } from "react";

/**
 * Backdrop + centered panel. Escape and a backdrop click both close it; the
 * panel itself stops propagation so a click inside doesn't. Renders nothing
 * while closed rather than hiding via CSS, so a closed modal never traps
 * tab order or announces itself to a screen reader.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full w-full max-w-md animate-pop-in overflow-y-auto rounded-card bg-surface p-7 shadow-pop"
      >
        <h2
          id={titleId}
          className="font-display text-2xl font-sans-semibold tracking-heading text-ink"
        >
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
