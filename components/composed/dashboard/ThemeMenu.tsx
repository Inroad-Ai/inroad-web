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
      trigger={<Current />}
      items={THEME_OPTIONS.map(({ value, label, Icon: OptionIcon }) => ({
        key: value,
        label: (
          <>
            <OptionIcon />
            {label}
            {value === preference ? (
              <span className="ml-auto text-signal-teal">
                <CheckCircleIcon />
              </span>
            ) : null}
          </>
        ),
        onSelect: () => setPreference(value),
      }))}
    />
  );
}
