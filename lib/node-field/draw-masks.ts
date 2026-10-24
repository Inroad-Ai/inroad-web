import type { MaskRect } from "./node-field.types";

// Off-canvas shadow trick: shapes are drawn far left so only their blurred
// shadow lands on the canvas, which is what gives masks a feathered edge.
const SHADOW_OFFSET = 30000;
// destination-out only reads alpha, so the mask's colour never shows.
const MASK_FILL = "black";

export function drawMasks(
  ctx: CanvasRenderingContext2D,
  masks: readonly MaskRect[],
  dpr: number,
): void {
  if (!masks.length) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = ctx.shadowColor = MASK_FILL;
  ctx.shadowOffsetX = SHADOW_OFFSET;
  for (const m of masks) {
    ctx.shadowBlur = m.feather * dpr;
    ctx.beginPath();
    ctx.roundRect(m.x * dpr - SHADOW_OFFSET, m.y * dpr, m.w * dpr, m.h * dpr, m.r * dpr);
    ctx.fill();
  }
  ctx.restore();
}
