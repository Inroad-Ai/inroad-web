import type { JSX, ReactNode } from "react";

export interface IconProps {
  /** Size classes; defaults to h-4 w-4 so an icon matches 14-16px text. */
  className?: string;
}

export type IconComponent = (props: IconProps) => JSX.Element;

/** currentColor stroke, so every icon takes the colour of the row it sits in.
 * The stroke scales with the grid, so 16- and 24-unit icons render the same
 * 1.5px line at the default size. */
export function Icon({
  children,
  className = "h-4 w-4",
  grid = 16,
}: {
  children: ReactNode;
  className?: string;
  grid?: 16 | 24;
}) {
  return (
    <svg
      viewBox={`0 0 ${grid} ${grid}`}
      aria-hidden
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={(1.5 * grid) / 16}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
