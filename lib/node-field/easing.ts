export const clamp = (v: number, lo = 0, hi = 1): number => Math.max(lo, Math.min(hi, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
