/**
 * 32-unit grid, 3-unit stroke, so it survives rendering at 16px in a tab.
 * app/icon.svg is the same artwork with literal colours, since a static
 * favicon can't reach the CSS custom properties.
 */
export function Logo({
  variant = "full",
  className = "",
}: {
  variant?: "mark" | "full";
  className?: string;
}) {
  const mark = (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={variant === "mark" ? `h-8 w-8 ${className}` : "h-8 w-8 shrink-0"}
    >
      <rect width="32" height="32" rx="9" className="fill-signal-amber" />
      <g
        transform="translate(1.5 0)"
        fill="none"
        className="stroke-ink"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21.5V15.5A5 5 0 0 1 14 10.5H20.5" />
        <path d="M17.25 6.75 21.75 10.5 17.25 14.25" />
      </g>
      <rect x="8.75" y="23.5" width="3.5" height="3.5" rx="1" className="fill-ink" />
    </svg>
  );

  if (variant === "mark") return mark;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span className="font-display text-lg font-semibold tracking-tight text-ink">Inroad</span>
    </span>
  );
}
