import { drawCenterNode, drawSpoke } from "./canvas-primitives";
import { drawFieldNode } from "./draw-field-node";
import { clamp, easeOut } from "./easing";
import { CENTER_GLOW, TAU } from "./node-field.constants";
import type { FieldActivity, SceneFrame } from "./node-field.types";
import { rgb, rgba, tone } from "./palette";

const DOTTED_RING_DASH = [1.2, 6];
const DUST_DRIFT = 2;

function drawRings({ ctx, palette, field }: SceneFrame): void {
  field.radii.forEach((r, k) => {
    const isDotted = k % 2 === 1;
    ctx.setLineDash(isDotted ? DOTTED_RING_DASH : []);
    ctx.strokeStyle = rgba(
      palette.node,
      isDotted ? tone(palette, 0.3, 0.42) : tone(palette, 0.1, 0.16),
    );
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(field.center.x, field.center.y, r, 0, TAU);
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

function drawDust({ ctx, palette, field, motionTime }: SceneFrame): void {
  ctx.fillStyle = rgb(palette.node);
  for (const n of field.dust) {
    ctx.globalAlpha = n.alpha * (0.6 + 0.4 * Math.sin(motionTime * n.speed + n.phase));
    ctx.fillRect(
      n.x + Math.sin(motionTime * n.speed * 0.3 + n.phase) * DUST_DRIFT,
      n.y + Math.cos(motionTime * n.speed * 0.25 + n.phase) * DUST_DRIFT,
      n.size,
      n.size,
    );
  }
}

function drawProbes({ ctx, palette, field, time }: SceneFrame, activity: FieldActivity): void {
  for (const pr of activity.probes) {
    const age = time - pr.t0;
    const fade = age < 0.6 ? 1 : clamp(1 - (age - 0.6) / 0.8);
    drawSpoke(
      ctx,
      field.center,
      pr.node.x,
      pr.node.y,
      easeOut(clamp(age / 0.35)),
      rgba(palette.node, tone(palette, 0.2, 0.3) * fade),
    );
  }
}

/** Rings, dust, probes and ring nodes: the graph both ambient and research modes sit on. */
export function drawGraphBackdrop(frame: SceneFrame, activity: FieldActivity): void {
  drawRings(frame);
  drawDust(frame);
  drawProbes(frame, activity);
  const { ctx, palette, field, motionTime } = frame;
  for (const n of field.ring)
    if (!n.hidden) drawFieldNode(ctx, palette, field.center, n, motionTime, false);
}

export function drawGraphCenter({ ctx, palette, field, motionTime }: SceneFrame): void {
  drawCenterNode(ctx, palette, field.center, CENTER_GLOW.graph + Math.sin(motionTime * 1.6) * 8);
}
