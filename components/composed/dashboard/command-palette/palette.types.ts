import type { ReactNode } from "react";

export const PALETTE_GROUPS = ["Go to", "Actions", "Companies"] as const;

export type PaletteGroup = (typeof PALETTE_GROUPS)[number];

export interface PaletteCommand {
  id: string;
  group: PaletteGroup;
  label: string;
  hint?: string;
  icon: ReactNode;
  run: () => void;
}
