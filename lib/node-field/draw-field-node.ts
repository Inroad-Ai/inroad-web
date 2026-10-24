import { drawDot, drawGlow, drawSpoke } from "./canvas-primitives";
import { clamp, easeOut, lerp } from "./easing";
import { FADE_TIME, LINE_IN, TAU } from "./node-field.constants";
import type { FieldNode, Palette, Point } from "./node-field.types";
import { rgb, rgba, tone } from "./palette";

function drawFading(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  center: Point,
  n: FieldNode,
  age: number,
): void {
  const a = 1 - clamp(age / FADE_TIME);
  drawSpoke(ctx, center, n.x, n.y, 1, rgba(palette.teal, tone(palette, 0.3, 0.38) * a));
  drawDot(ctx, n.x, n.y, n.size, rgb(palette.node), n.alpha * (1 - a));
  drawGlow(ctx, palette.teal, n.x, n.y, 28, 0.5 * a);
}

function drawScanning(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  center: Point,
  n: FieldNode,
  age: number,
  motionTime: number,
  isNamed: boolean,
): void {
  const reach = easeOut(clamp(age / LINE_IN));
  drawSpoke(ctx, center, n.x, n.y, reach, rgba(palette.fit, tone(palette, 0.55, 0.7)));
  const pulse = (0.5 + 0.5 * Math.sin(motionTime * 5)) * 8;
  drawGlow(ctx, palette.fit, n.x, n.y, (isNamed ? 38 : 26) + pulse, tone(palette, 0.7, 0.55));
  drawDot(ctx, n.x, n.y, isNamed ? 3.2 : 2.4, rgb(palette.core), 1);
}

function drawLit(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  center: Point,
  n: FieldNode,
  sinceLit: number,
  isNamed: boolean,
): void {
  const settle = clamp(sinceLit / 0.5);
  const tealSpoke = isNamed ? tone(palette, 0.42, 0.5) : tone(palette, 0.3, 0.38);
  drawSpoke(ctx, center, n.x, n.y, 1, rgba(palette.fit, tone(palette, 0.5, 0.65) * (1 - settle)));
  drawSpoke(ctx, center, n.x, n.y, 1, rgba(palette.teal, tealSpoke * settle));
  const pop = easeOut(clamp(sinceLit / 0.6));
  drawGlow(ctx, palette.teal, n.x, n.y, isNamed ? 40 : 30, tone(palette, 0.55, 0.4));
  ctx.globalAlpha = 1;
  ctx.strokeStyle = rgba(palette.teal, tone(palette, 0.7, 0.8));
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(n.x, n.y, lerp(3, isNamed ? 10 : 8, pop), 0, TAU);
  ctx.stroke();
  drawDot(ctx, n.x, n.y, isNamed ? 3.2 : 2.6, rgb(palette.teal), 1);
}

/** Named nodes skip the spoke-in delay: their scan state already drew it. */
export function drawFieldNode(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  center: Point,
  n: FieldNode,
  motionTime: number,
  isNamed: boolean,
): void {
  const age = motionTime - n.t0;
  const delay = isNamed ? 0 : LINE_IN;
  if (n.state === "fade") return drawFading(ctx, palette, center, n, age);
  if (n.state === "scan" || (n.state === "lit" && age < delay))
    return drawScanning(ctx, palette, center, n, age, motionTime, isNamed);
  if (n.state === "lit") return drawLit(ctx, palette, center, n, age - delay, isNamed);
  const twinkle = isNamed ? 1 : 0.75 + 0.25 * Math.sin(motionTime * n.speed + n.phase);
  drawDot(ctx, n.x, n.y, n.size, rgb(palette.node), n.alpha * tone(palette, 1, 1.3) * twinkle);
}
