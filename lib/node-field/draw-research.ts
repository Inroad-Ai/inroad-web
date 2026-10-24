import { applyLabelFont } from "./canvas-primitives";
import { drawFieldNode } from "./draw-field-node";
import { drawGraphBackdrop, drawGraphCenter } from "./draw-graph-backdrop";
import { isInMask } from "./mask-geometry";
import { LABEL_OFFSET } from "./node-field.constants";
import type { FieldActivity, SceneFrame } from "./node-field.types";
import { rgb } from "./palette";

const LABEL_EDGE = 8;
const LABEL_MASK_MARGIN = 6;

function drawNamedLabels({ ctx, palette, field, masks }: SceneFrame): void {
  applyLabelFont(ctx, palette);
  for (const n of field.named) {
    if (n.hidden) continue;
    const isDone = n.state === "lit";
    const isActive = isDone || n.state === "scan";
    const label = n.label.toUpperCase();
    const detail = isDone && n.detail ? `  ${n.detail}` : "";
    const width = ctx.measureText(label + detail).width;
    const x0 = n.x >= field.center.x ? n.x + LABEL_OFFSET : n.x - LABEL_OFFSET - width;
    if (
      x0 < LABEL_EDGE ||
      x0 + width > field.width - LABEL_EDGE ||
      isInMask(masks, x0, n.y, LABEL_MASK_MARGIN) ||
      isInMask(masks, x0 + width, n.y, LABEL_MASK_MARGIN)
    )
      continue;
    ctx.globalAlpha = isActive ? 1 : 0.85;
    ctx.fillStyle = rgb(isActive ? palette.text : palette.muted);
    ctx.fillText(label, x0, n.y);
    if (detail) {
      ctx.fillStyle = rgb(palette.teal);
      ctx.fillText(detail, x0 + ctx.measureText(label).width, n.y);
    }
  }
}

export function drawResearch(frame: SceneFrame, activity: FieldActivity): void {
  drawGraphBackdrop(frame, activity);
  const { ctx, palette, field, motionTime } = frame;
  for (const n of field.named)
    if (!n.hidden) drawFieldNode(ctx, palette, field.center, n, motionTime, true);
  drawGraphCenter(frame);
  drawNamedLabels(frame);
}
