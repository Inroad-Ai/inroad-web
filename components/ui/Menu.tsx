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
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 bg-ink/5 px-3 text-xs font-sans-semibold text-ink-muted transition-colors duration-fast hover:bg-ink/10 hover:text-ink aria-expanded:bg-ink/10 aria-expanded:text-ink disabled:pointer-events-none disabled:opacity-50"
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className={`absolute z-20 mt-2 min-w-56 animate-pop-in rounded-card bg-surface p-2 shadow-pop ${
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
              className="flex w-full items-center gap-2.5 rounded-nest px-3 py-2.5 text-left text-sm font-sans-semibold text-ink transition-colors duration-fast hover:bg-ink/10 focus-visible:bg-ink/10 disabled:pointer-events-none disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
