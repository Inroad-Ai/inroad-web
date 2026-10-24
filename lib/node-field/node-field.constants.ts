import type { Point } from "./node-field.types";

export const MAX_DPR = 2;
export const DEFAULT_CENTER: Point = { x: 0.5, y: 0.5 };
export const DEFAULT_SEED = 7;
export const RING_FRACTIONS = [0.24, 0.4, 0.58, 0.8];
export const MIN_REACH = 360;
export const RING_NODE_COUNT = 48;
export const NARROW_WIDTH = 700;
export const DUST_AREA = { narrow: 5200, wide: 8200 };
export const STORY_COUNT = { narrow: 380, wide: 860 };
export const STORY_DEFAULT_FITS = 12;
export const STORY_GATHER_END = 0.4;
export const NAMED_ANGLES = [
  200, -20, 20, 160, 235, -55, 55, 125, 180, 0, 90, 270, 145, 35, 215, -35,
];
export const NAMED_MIN_GAP = 110;
export const EDGE = 40;
export const LINE_IN = 0.55;
export const FADE_TIME = 0.9;
export const PROBE_LIFE = 1.4;
export const PROBE_EVERY = { ambient: 1.7, research: 0.3 };
export const LIGHT_EVERY = 3;
export const MAX_LIT = 3;
export const CENTER_GLOW = { graph: 96, story: 110 };
export const LABEL_FONT_PX = 11;
export const LABEL_OFFSET = 18;
export const MASK_DEFAULTS = { padding: 22, feather: 46, radius: 14 };
export const SPRITE_SIZE = 128;
export const RESOLVED = -1e4;
export const TAU = Math.PI * 2;
