import type { ReactNode } from "react";

/** Label above a control, with room for a line explaining a constraint. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="utility-label text-text-secondary">{label}</label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-2 text-xs text-text-secondary">{hint}</p> : null}
    </div>
  );
}
