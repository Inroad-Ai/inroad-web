import type { ReactNode } from "react";

const COMPACT_CLASSES = {
  on: "min-h-10 rounded-full border border-ink bg-ink px-4 py-2 text-center font-sans-semibold text-paper",
  off: "min-h-10 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-center font-sans-semibold text-ink hover:border-ink/40",
} as const;

const CARD_CLASSES = {
  on: "rounded-nest bg-signal-amber-subtle px-5 py-4 text-left text-ink ring-2 ring-inset ring-signal-amber",
  off: "rounded-nest bg-surface-raised px-5 py-4 text-left text-ink hover:-translate-y-px hover:bg-surface hover:shadow-card-hover",
} as const;

/** A card that behaves like a checkbox/radio - used for chip-style multi/single-select. */
export function SelectableCard({
  selected,
  onClick,
  autoFocus,
  children,
  compact = false,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  autoFocus?: boolean;
  children: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      autoFocus={autoFocus}
      onClick={onClick}
      className={`w-full font-sans text-sm transition duration-fast ease-standard ${
        compact ? COMPACT_CLASSES[selected ? "on" : "off"] : CARD_CLASSES[selected ? "on" : "off"]
      } ${className}`}
    >
      {children}
    </button>
  );
}
