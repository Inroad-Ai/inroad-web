"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface MenuItem {
  key: string;
  label: ReactNode;
  /** Rendered flat and unclickable — use for the option that's already current. */
  disabled?: boolean;
  onSelect: () => void;
}

interface MenuProps {
  /** Trigger content. Keep it short; the trigger is a small quiet control. */
  trigger: ReactNode;
  /** Accessible name for the trigger, since `trigger` is often just an icon. */
  label: string;
  items: MenuItem[];
  disabled?: boolean;
  /** Which edge of the trigger the panel lines up with. */
  align?: "left" | "right";
}

/**
 * A small click-to-open menu: trigger button plus a floating panel of
 * options. Closes on outside pointerdown, on Escape, and after a selection.
 *
 * Deliberately not a `<select>`: the options carry their own visuals (stage
 * badges) and a native select can't render those. Deliberately not a
 * headless-UI dependency either — this is the only menu in the app so far.
 *
 * Every event is stopped from propagating, so a Menu can sit inside a
 * clickable card without opening it turning into a click on the card.
 */
export function Menu({ trigger, label, items, disabled = false, align = "right" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // A disabled trigger can't close the panel, so don't leave one hanging.
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="utility-label inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-text-secondary transition-colors hover:border-signal-teal hover:text-signal-teal disabled:cursor-not-allowed disabled:text-text-secondary/40"
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className={`absolute z-10 mt-1 min-w-[11rem] rounded-md border border-line bg-surface p-1 shadow-overlay ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-raised disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
