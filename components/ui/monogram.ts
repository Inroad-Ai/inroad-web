const MONOGRAM_FILLS = [
  "bg-monogram-1",
  "bg-monogram-2",
  "bg-monogram-3",
  "bg-monogram-4",
  "bg-monogram-5",
  "bg-monogram-6",
] as const;

/** Same seed, same colour, on every page and every visit: a company's domain
 * or a person's name always lands on the same monogram fill. */
export function monogramFill(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash + char.charCodeAt(0)) % MONOGRAM_FILLS.length;
  return MONOGRAM_FILLS[hash];
}

export type MonogramSize = "xs" | "sm" | "md" | "lg" | "xl";

export const MONOGRAM_SIZES: Record<MonogramSize, string> = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

/** Tiles round less than avatars, and less still when small. */
export const TILE_RADIUS: Record<MonogramSize, string> = {
  xs: "rounded-sm",
  sm: "rounded-sm",
  md: "rounded-nest",
  lg: "rounded-nest",
  xl: "rounded-card",
};

export const MONOGRAM_FACE =
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-display font-sans-semibold tracking-heading text-chalk shadow-nest before:absolute before:inset-0 before:bg-gradient-to-br before:from-chalk/20 before:to-transparent";
