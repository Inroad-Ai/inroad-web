import { THEME_ATTRIBUTE } from "./theme.constants";
import type { ResolvedTheme } from "./theme.types";

export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}
