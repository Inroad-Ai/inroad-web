/** An on/off control that saves on its own, so it is a button with
 * role="switch", not a checkbox inside a form. */
export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** The accessible name; the visible label sits beside it. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-fast ease-standard disabled:pointer-events-none disabled:opacity-50 ${
        checked ? "border-signal-amber bg-signal-amber" : "border-ink/15 bg-ink/10"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-4 w-4 rounded-full bg-paper shadow-card transition-transform duration-fast ease-standard ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
