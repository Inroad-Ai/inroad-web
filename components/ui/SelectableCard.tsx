import type { ReactNode } from "react";

/** A card that behaves like a checkbox/radio - used for chip-style multi/single-select. */
export function SelectableCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full rounded-sm border px-5 py-4 text-left font-sans text-sm transition-colors ${
        selected
          ? "border-signal-teal bg-signal-teal-subtle text-text-primary"
          : "border-line bg-surface text-text-primary hover:border-signal-teal/60"
      }`}
    >
      {children}
    </button>
  );
}
