import type { ReactNode } from "react";

import { Card } from "./Card";

interface RepeatableListProps<T> {
  items: T[];
  onChange: (next: T[]) => void;
  /** A blank row, shaped by the caller. This component never invents one. */
  newItem: () => T;
  addLabel: string;
  emptyLabel: string;
  children: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
}

/**
 * Add and remove rows of whatever the caller renders inside each one.
 * Generic on purpose: it knows how many rows there are and nothing about
 * what a row means.
 */
export function RepeatableList<T>({
  items,
  onChange,
  newItem,
  addLabel,
  emptyLabel,
  children,
}: RepeatableListProps<T>) {
  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="rounded-nest border-2 border-dashed border-ink/15 p-5 text-sm text-ink-muted">
          {emptyLabel}
        </p>
      ) : null}

      {items.map((item, index) => (
        // Index as key: rows have no identity of their own, and they are only
        // ever added or removed, never reordered.
        <Card key={index} variant="nested">
          <div className="flex items-start justify-between gap-4">
            <span className="utility-label text-ink-faint">#{index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="utility-label text-ink-muted transition-colors duration-fast hover:text-error"
            >
              Remove
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {children(item, (patch) => update(index, patch), index)}
          </div>
        </Card>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="text-sm font-sans-semibold text-signal-teal transition-colors duration-fast hover:text-signal-teal-hover"
      >
        {addLabel}
      </button>
    </div>
  );
}
