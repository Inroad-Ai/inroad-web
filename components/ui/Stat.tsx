import type { ReactNode } from "react";

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-sans-semibold tracking-display tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-faint">{label}</p>
    </div>
  );
}
