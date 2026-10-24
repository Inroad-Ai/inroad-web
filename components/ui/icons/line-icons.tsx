import { Icon, type IconProps } from "./Icon";

export function SparkIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
    </Icon>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icon>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.8 12.2 8.7-8.7M17 6l2.5 2.5M14.5 8.5 16.5 10.5" />
    </Icon>
  );
}

export function ReplayIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </Icon>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Icon>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </Icon>
  );
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </Icon>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Icon>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M21 3 10 14" />
      <path d="M21 3l-7 18-4-7-7-4z" />
    </Icon>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </Icon>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </Icon>
  );
}

export function DocIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Icon>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13 7 4 4" />
    </Icon>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M6 5v14" />
      <path d="M10 12h9" />
      <path d="M15 7.5 19.5 12 15 16.5" />
    </Icon>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <Icon grid={24} className={className}>
      <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </Icon>
  );
}
