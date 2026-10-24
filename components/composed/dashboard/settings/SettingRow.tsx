import type { ReactNode } from "react";

/** A label and its one-line explanation on the left, the control on the right. */
export function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-5 first:border-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-sans-semibold text-ink">{label}</p>
        <p className="mt-1 text-xs text-ink-muted">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
