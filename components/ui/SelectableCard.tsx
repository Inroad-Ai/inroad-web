import type { ReactNode } from "react";

/** A card that behaves like a checkbox/radio - used for chip-style multi/single-select. */
export function SelectableCard({
  selected,
  onClick,
  children,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full border font-sans text-sm transition-colors ${
        compact ? "rounded-sm px-4 py-3 text-center" : "rounded-md px-5 py-4 text-left"
      } ${
        selected
          ? "border-signal-teal bg-signal-teal-subtle text-text-primary shadow-card"
          : "border-line bg-surface text-text-primary hover:border-signal-teal/60"
      }`}
    >
      {children}
    </button>
  );
}
