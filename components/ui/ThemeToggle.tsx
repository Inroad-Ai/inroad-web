import type { ThemePreference } from "@/lib/theme/theme.types";

import { IconButton } from "./IconButton";
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
 * owns the preference (hooks/useTheme) and this only renders it. */
export function ThemeToggle({
  value,
  onChange,
}: {
  value: ThemePreference;
  onChange: (next: ThemePreference) => void;
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
            onClick={() => onChange(option)}
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3.5 font-sans text-sm font-sans-semibold transition duration-fast ease-standard ${selected ? "bg-surface text-ink shadow-nest" : "text-ink-muted hover:text-ink"}`}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** One round button showing the current preference; each click moves to the
 * next one (light, dark, system). For headers, where the full control is too wide. */
export function ThemeCycleButton({
  value,
  onChange,
}: {
  value: ThemePreference;
  onChange: (next: ThemePreference) => void;
}) {
  const index = Math.max(
    0,
    THEME_OPTIONS.findIndex((option) => option.value === value),
  );
  const { label, Icon } = THEME_OPTIONS[index];
  const next = THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length];
  const description = `Theme: ${label}. Switch to ${next.label.toLowerCase()}`;
  return (
    <IconButton label={description} title={description} onClick={() => onChange(next.value)}>
      <Icon />
    </IconButton>
  );
}
