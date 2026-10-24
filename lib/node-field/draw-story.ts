import { applyLabelFont, drawCenterNode, drawDot, drawGlow, drawSpoke } from "./canvas-primitives";
import { clamp, easeInOut, easeOut, lerp } from "./easing";
import { storyFitCount } from "./field-layout";
import { isInMask } from "./mask-geometry";
import { CENTER_GLOW, NARROW_WIDTH, STORY_GATHER_END } from "./node-field.constants";
import type { SceneFrame, StoryModeProps, StoryParticle } from "./node-field.types";
import { rgb, rgba } from "./palette";

const MIN_PARTICLE_ALPHA = 0.012;
const PARTICLE_DRIFT = 2.2;
const SPOKES_FROM = 0.45;
const LABELS_FROM = 0.6;

export function drawStory(frame: SceneFrame, p: StoryModeProps): void {
  const { ctx, palette, field, masks, motionTime: tt } = frame;
  const { center, story } = field;
  const fits = storyFitCount(p.nodes);
  const spread = easeOut(clamp(p.progress / STORY_GATHER_END));
  const filter = easeInOut(clamp((p.progress - STORY_GATHER_END) / (1 - STORY_GATHER_END)));
  const keep = 1 - 0.93 * filter;
  const gatheredX = (s: StoryParticle) => center.x + (s.homeX - center.x) * spread;
  const gatheredY = (s: StoryParticle) => center.y + (s.homeY - center.y) * spread;
  const fitPosition = (s: StoryParticle) => [
    lerp(gatheredX(s), s.fitX, filter),
    lerp(gatheredY(s), s.fitY, filter),
  ];

  ctx.fillStyle = rgb(palette.node);
  for (let i = fits; i < story.length; i++) {
    const s = story[i];
    const a = s.alpha * spread * keep * (0.6 + 0.4 * Math.sin(tt * s.speed + s.phase));
    if (a < MIN_PARTICLE_ALPHA) continue;
    ctx.globalAlpha = a;
    ctx.fillRect(
      gatheredX(s) + Math.sin(tt * s.speed * 0.3 + s.phase) * PARTICLE_DRIFT * spread,
      gatheredY(s) + Math.cos(tt * s.speed * 0.25 + s.phase) * PARTICLE_DRIFT * spread,
      s.size,
      s.size,
    );
  }

  const fitParticles = story.slice(0, fits);
  if (filter > SPOKES_FROM) {
    const spokeAlpha = ((filter - SPOKES_FROM) / (1 - SPOKES_FROM)) * 0.22;
    for (const s of fitParticles) {
      const [x, y] = fitPosition(s);
      drawSpoke(ctx, center, x, y, 1, rgba(palette.fit, spokeAlpha));
    }
  }

  applyLabelFont(ctx, palette);
  fitParticles.forEach((s, i) => {
    const [x, y] = fitPosition(s);
    const isLead = i === 0;
    drawGlow(
      ctx,
      palette.fit,
      x,
      y,
      (isLead ? 46 : 26) * (0.35 + filter) + Math.sin(tt * 2 + i) * 2,
      (0.25 + 0.75 * filter) * spread,
    );
    drawDot(ctx, x, y, (isLead ? 2.6 : 1.8) + filter * 0.8, rgb(palette.core), spread);
    const label = p.nodes?.[i]?.label;
    const hasRoom = field.width >= NARROW_WIDTH || isLead;
    if (label && filter > LABELS_FROM && hasRoom && !isInMask(masks, x, y, 6)) {
      ctx.globalAlpha = (filter - LABELS_FROM) / (1 - LABELS_FROM);
      ctx.fillStyle = rgb(palette.text);
      ctx.fillText(label.toUpperCase(), x + 10, y);
    }
  });

  drawCenterNode(ctx, palette, center, CENTER_GLOW.story + Math.sin(tt * 1.6) * 10);
}
