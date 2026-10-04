import { THEME_ATTRIBUTE } from "./theme.constants";
import type { ResolvedTheme } from "./theme.types";

// Light is the absence of the attribute, matching the init script.
export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement;
  if (theme === "dark") root.setAttribute(THEME_ATTRIBUTE, "dark");
  else root.removeAttribute(THEME_ATTRIBUTE);
}

export function clearTheme(): void {
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
}
