import { clamp, lerp } from "./easing";
import { SPRITE_SIZE, TAU } from "./node-field.constants";
import type { Palette, Point } from "./node-field.types";
import { rgb, rgba } from "./palette";

const MIN_VISIBLE_ALPHA = 0.003;
const CENTER_DOT_RADIUS = 4.2;

const glowSprites = new Map<string, HTMLCanvasElement>();

function glowSprite(channels: string): HTMLCanvasElement {
  const cached = glowSprites.get(channels);
  if (cached) return cached;
  const size = SPRITE_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d");
  if (g) {
    const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, rgba(channels, 1));
    gradient.addColorStop(0.22, rgba(channels, 0.5));
    gradient.addColorStop(1, rgba(channels, 0));
    g.fillStyle = gradient;
    g.fillRect(0, 0, size, size);
  }
  glowSprites.set(channels, canvas);
  return canvas;
}

export function drawGlow(
  ctx: CanvasRenderingContext2D,
  channels: string,
  x: number,
  y: number,
  size: number,
  a: number,
): void {
  if (a <= MIN_VISIBLE_ALPHA || size <= 0) return;
  ctx.globalAlpha = clamp(a);
  ctx.drawImage(glowSprite(channels), x - size / 2, y - size / 2, size, size);
}

export function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill: string,
  a: number,
): void {
  if (a <= MIN_VISIBLE_ALPHA) return;
  ctx.globalAlpha = clamp(a);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/** A line from the centre towards (x, y), drawn `progress` of the way. */
export function drawSpoke(
  ctx: CanvasRenderingContext2D,
  center: Point,
  x: number,
  y: number,
  progress: number,
  stroke: string,
): void {
  if (progress <= 0) return;
  ctx.globalAlpha = 1;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(lerp(center.x, x, progress), lerp(center.y, y, progress));
  ctx.stroke();
}

export function drawCenterNode(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  center: Point,
  glowSize: number,
): void {
  drawGlow(ctx, palette.core, center.x, center.y, glowSize, 1);
  drawDot(ctx, center.x, center.y, CENTER_DOT_RADIUS, rgb(palette.core), 1);
}

export function applyLabelFont(ctx: CanvasRenderingContext2D, palette: Palette): void {
  ctx.font = palette.font;
  ctx.textBaseline = "middle";
}
