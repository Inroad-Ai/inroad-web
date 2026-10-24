"use client";

import { CheckCircleIcon, MonitorIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { THEME_OPTIONS } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

export function ThemeMenu() {
  const { preference, setPreference } = useTheme();
  const Current = THEME_OPTIONS.find((option) => option.value === preference)?.Icon ?? MonitorIcon;

  return (
    <Menu
      label="Theme"
      size="icon"
      trigger={<Current />}
      items={THEME_OPTIONS.map(({ value, label, Icon: OptionIcon }) => ({
        key: value,
        label: (
          <>
            <span className="text-ink-muted">
              <OptionIcon />
            </span>
            {label}
            {value === preference ? (
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-signal-teal">
                <CheckCircleIcon />
                <span className="sr-only">Current</span>
              </span>
            ) : null}
          </>
        ),
        onSelect: () => setPreference(value),
      }))}
    />
  );
}
