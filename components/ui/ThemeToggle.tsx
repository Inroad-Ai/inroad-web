import type { ThemePreference } from "@/lib/theme/theme.types";

import { MonitorIcon, MoonIcon, SunIcon, type IconComponent } from "./Icons";

export const THEME_OPTIONS: readonly {
  value: ThemePreference;
  label: string;
  Icon: IconComponent;
}[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
];

/** Light / Dark / System as one segmented control. Controlled: the caller
 * owns the preference (hooks/useTheme) and this only renders it. `compact`
 * drops the words and keeps the icons. */
export function ThemeToggle({
  value,
  onChange,
  compact = false,
}: {
  value: ThemePreference;
  onChange: (next: ThemePreference) => void;
  compact?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex gap-0.5 rounded-full border border-line bg-ink/5 p-1"
    >
      {THEME_OPTIONS.map(({ value: option, label, Icon }) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            aria-label={compact ? label : undefined}
            onClick={() => onChange(option)}
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full font-sans text-sm font-sans-semibold transition duration-fast ease-standard ${
              compact ? "w-8" : "px-3.5"
            } ${selected ? "bg-surface text-ink shadow-nest" : "text-ink-muted hover:text-ink"}`}
          >
            <Icon />
            {compact ? null : label}
          </button>
        );
      })}
    </div>
  );
}
