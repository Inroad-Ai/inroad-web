import type { ReactNode } from "react";

/** One read-only label/value pair. Renders dt/dd, so it belongs inside a
 * `<dl>`. Not to be confused with ui/Field, which labels a form control. */
export function DataField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="utility-label text-ink-muted">{label}</dt>
      <dd className="mt-1.5 font-sans text-sm font-sans-medium text-ink">{children}</dd>
    </div>
  );
}
