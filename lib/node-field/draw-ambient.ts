import { drawGraphBackdrop, drawGraphCenter } from "./draw-graph-backdrop";
import type { FieldActivity, SceneFrame } from "./node-field.types";

export function drawAmbient(frame: SceneFrame, activity: FieldActivity): void {
  drawGraphBackdrop(frame, activity);
  drawGraphCenter(frame);
}
