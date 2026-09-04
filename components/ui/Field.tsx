import type { ReactNode } from "react";

/** Label above a control, with room for a line explaining a constraint. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  labelId,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  htmlFor?: string;
  labelId?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        id={labelId}
        className="utility-label text-text-secondary"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={errorId} className="mt-2 text-xs text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-text-secondary">{hint}</p> : null}
    </div>
  );
}
