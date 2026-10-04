"use client";

import { CheckCircleIcon, MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/lib/theme/theme.types";

const OPTIONS: { value: ThemePreference; label: string; icon: () => JSX.Element }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const Current = OPTIONS.find((option) => option.value === preference)?.icon ?? MonitorIcon;

  return (
    <Menu
      label="Theme"
      trigger={<Current />}
      items={OPTIONS.map(({ value, label, icon: OptionIcon }) => ({
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
