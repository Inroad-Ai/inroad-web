import type { ReactNode } from "react";

/** 16-unit grid, 1.5 stroke, currentColor: every icon inherits the colour of
 * the row it sits in, so callers style the row, never the icon. */
function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {children}
    </svg>
  );
}

/** Points the direction the collapse toggle will move things. */
export function ChevronIcon({ isFlipped }: { isFlipped: boolean }) {
  return (
    <Icon className={`transition-transform ${isFlipped ? "rotate-180" : ""}`}>
      <path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function GridIcon() {
  return (
    <Icon>
      <rect x="1.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="1.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
    </Icon>
  );
}

export function SearchIcon() {
  return (
    <Icon>
      <circle cx="7.25" cy="7.25" r="4.5" />
      <path d="M10.6 10.6 13.75 13.75" strokeLinecap="round" />
    </Icon>
  );
}

export function BuildingIcon() {
  return (
    <Icon>
      <path d="M1.75 13.75h12.5" strokeLinecap="round" />
      <path d="M3.5 13.75V3a.75.75 0 0 1 .75-.75h4.5A.75.75 0 0 1 9.5 3v10.75" strokeLinejoin="round" />
      <path d="M9.5 6.75h2.25a.75.75 0 0 1 .75.75v6.25" strokeLinejoin="round" />
      <path d="M5.25 5h2M5.25 7.75h2" strokeLinecap="round" />
      <path d="M5.75 13.75v-2.5h1.5v2.5" strokeLinejoin="round" />
    </Icon>
  );
}

export function BoardIcon() {
  return (
    <Icon>
      <rect x="1.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <rect x="8.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <path d="M3.25 5.75h2.5M10.25 5.75h2.5" strokeLinecap="round" />
    </Icon>
  );
}

export function SlidersIcon() {
  return (
    <Icon>
      <path d="M2 4.25h2.25M7.75 4.25H14M2 11.75h6.75M12.25 11.75H14" strokeLinecap="round" />
      <circle cx="6" cy="4.25" r="1.75" />
      <circle cx="10.5" cy="11.75" r="1.75" />
    </Icon>
  );
}

export function SignOutIcon() {
  return (
    <Icon>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" strokeLinecap="round" />
      <path d="M9.5 5.25 12.25 8 9.5 10.75M12.25 8H6.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}
