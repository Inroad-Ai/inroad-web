import { Icon, type IconProps } from "./Icon";

/** Points the direction the collapse toggle will move things. */
export function ChevronIcon({ isFlipped }: { isFlipped: boolean }) {
  return (
    <Icon className={`h-4 w-4 transition-transform ${isFlipped ? "rotate-180" : ""}`}>
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </Icon>
  );
}

/** Points down when closed ("click to reveal what's below"), flips to
 * point up when open - the accordion-disclosure convention, distinct from
 * ChevronIcon's left/right pointing, which is for things that move
 * sideways (the collapse toggle). */
export function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <Icon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}>
      <path d="M3.5 6 8 10.5 12.5 6" />
    </Icon>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="1.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="1.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
    </Icon>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="7.25" cy="7.25" r="4.5" />
      <path d="M10.6 10.6 13.75 13.75" />
    </Icon>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M1.75 13.75h12.5" />
      <path d="M3.5 13.75V3a.75.75 0 0 1 .75-.75h4.5A.75.75 0 0 1 9.5 3v10.75" />
      <path d="M9.5 6.75h2.25a.75.75 0 0 1 .75.75v6.25" />
      <path d="M5.25 5h2M5.25 7.75h2" />
      <path d="M5.75 13.75v-2.5h1.5v2.5" />
    </Icon>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="5.25" r="2.75" />
      <path d="M2.75 13.25c0-2.9 2.35-5.25 5.25-5.25s5.25 2.35 5.25 5.25" />
    </Icon>
  );
}

export function BoardIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="1.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <rect x="8.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <path d="M3.25 5.75h2.5M10.25 5.75h2.5" />
    </Icon>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M2 4.25h2.25M7.75 4.25H14M2 11.75h6.75M12.25 11.75H14" />
      <circle cx="6" cy="4.25" r="1.75" />
      <circle cx="10.5" cy="11.75" r="1.75" />
    </Icon>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6.5 2.75H3.5a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-3" />
      <path d="M8.75 2.75h4.5v4.5" />
      <path d="M13.25 2.75 7 9" />
    </Icon>
  );
}

export function PlugIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M5.5 1.75v3M10.5 1.75v3" />
      <path d="M3.75 4.75h8.5v2.5a4.25 4.25 0 0 1-4.25 4.25 4.25 4.25 0 0 1-4.25-4.25v-2.5Z" />
      <path d="M8 11.5v2.75" />
    </Icon>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="8" r="6.25" />
      <circle cx="8" cy="8" r="3.25" />
      <circle cx="8" cy="8" r="0.75" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function DocumentSearchIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M9 1.75H4a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h3.25" />
      <path d="M9 1.75 12.25 5v1.5" />
      <path d="M9 1.75V5h3.25" />
      <circle cx="9.25" cy="10.25" r="2.25" />
      <path d="M11 12l1.75 1.75" />
    </Icon>
  );
}

export function MessageIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M2 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-.75.75H7.5l-3 2.5v-2.5H2.75a.75.75 0 0 1-.75-.75v-6.5Z" />
      <path d="M4.5 6.25h7M4.5 8.5h4.5" />
    </Icon>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" />
    </Icon>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 10.25V2.5M8 2.5 5.25 5.25M8 2.5l2.75 2.75" />
      <path d="M2.75 10.75v1.5c0 .552.448 1 1 1h8.5c.552 0 1-.448 1-1v-1.5" />
    </Icon>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M5.25 8.25 7.1 10l3.65-3.9" />
    </Icon>
  );
}

export function SpinnerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <Icon className={`animate-spin ${className}`}>
      <path d="M8 1.75a6.25 6.25 0 1 1-6.25 6.25" />
    </Icon>
  );
}

export function AlertCircleIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 5.25v3.5" />
      <circle cx="8" cy="10.75" r="0.75" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </Icon>
  );
}

export function SignOutIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" />
      <path d="M9.5 5.25 12.25 8 9.5 10.75M12.25 8H6.5" />
    </Icon>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.05 1.05M11.55 11.55l1.05 1.05M3.4 12.6l1.05-1.05M11.55 4.45l1.05-1.05" />
    </Icon>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M13.25 9.5A5.5 5.5 0 0 1 6.5 2.75a5.5 5.5 0 1 0 6.75 6.75Z" />
    </Icon>
  );
}

export function MonitorIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="2" y="2.5" width="12" height="8" rx="1.25" />
      <path d="M5.5 13.5h5M8 10.5v3" />
    </Icon>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </Icon>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3.75 3.75 12.25 12.25M12.25 3.75 3.75 12.25" />
    </Icon>
  );
}
