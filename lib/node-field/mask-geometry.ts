import { MASK_DEFAULTS } from "./node-field.constants";
import type { MaskRect, NodeFieldMask } from "./node-field.types";

const MIN_MASK_SIDE = 4;

export function measureMasks(base: DOMRect, masks: readonly NodeFieldMask[]): MaskRect[] {
  return masks.flatMap((mask) => {
    const box = mask.target.current?.getBoundingClientRect();
    if (!box || box.width < MIN_MASK_SIDE || box.height < MIN_MASK_SIDE) return [];
    const pad = mask.padding ?? MASK_DEFAULTS.padding;
    return [
      {
        x: box.left - base.left - pad,
        y: box.top - base.top - pad,
        w: box.width + pad * 2,
        h: box.height + pad * 2,
        r: (mask.radius ?? MASK_DEFAULTS.radius) + pad,
        feather: mask.feather ?? MASK_DEFAULTS.feather,
      },
    ];
  });
}

export const isInMask = (
  masks: readonly MaskRect[],
  x: number,
  y: number,
  margin: number,
): boolean =>
  masks.some(
    (m) => x > m.x - margin && x < m.x + m.w + margin && y > m.y - margin && y < m.y + m.h + margin,
  );
