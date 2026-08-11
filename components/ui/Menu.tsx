"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface MenuItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}

interface MenuProps {
  trigger: ReactNode;
  label: string;
  items: MenuItem[];
  disabled?: boolean;
  align?: "left" | "right";
}

/**
 * Not a `<select>`: options render their own visuals (stage badges). Events
 * stop propagating so this can sit inside a clickable card.
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
