import { THEME_ATTRIBUTE } from "@/lib/theme/theme.constants";

import { clamp } from "./easing";
import { LABEL_FONT_PX } from "./node-field.constants";
import type { Palette } from "./node-field.types";

export function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const channels = (name: string) => styles.getPropertyValue(name).trim().split(/\s+/).join(",");
  return {
    node: channels("--color-node"),
    fit: channels("--color-node-fit"),
    core: channels("--color-node-core"),
    teal: channels("--color-signal-teal"),
    text: channels("--color-ink"),
    muted: channels("--color-ink-muted"),
    font: `500 ${LABEL_FONT_PX}px ${styles.getPropertyValue("--font-mono").trim()}`,
    isLight: document.documentElement.getAttribute(THEME_ATTRIBUTE) === "light",
  };
}

export const rgb = (channels: string): string => `rgb(${channels})`;

export const rgba = (channels: string, a: number): string =>
  `rgba(${channels},${clamp(a).toFixed(3)})`;

export const tone = (palette: Palette, night: number, day: number): number =>
  palette.isLight ? day : night;
