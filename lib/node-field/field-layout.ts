import { isInMask } from "./mask-geometry";
import {
  DEFAULT_CENTER,
  DEFAULT_SEED,
  DUST_AREA,
  EDGE,
  MIN_REACH,
  NAMED_ANGLES,
  NAMED_MIN_GAP,
  NARROW_WIDTH,
  RING_FRACTIONS,
  RING_NODE_COUNT,
  STORY_COUNT,
  STORY_DEFAULT_FITS,
  TAU,
} from "./node-field.constants";
import type {
  FieldLayout,
  FieldNode,
  MaskRect,
  NamedNode,
  NodeFieldNode,
  NodeFieldProps,
  Point,
  StoryParticle,
} from "./node-field.types";
import { mulberry32 } from "./seeded-random";

const RING_MASK_MARGIN = 14;
const NAMED_NODE_SIZE = 2.4;

/** Anything that changes where nodes sit; a change re-runs layout. */
export function layoutKey(p: NodeFieldProps): string {
  const labels = p.mode === "ambient" ? [] : (p.nodes ?? []).map((n) => n.label);
  return JSON.stringify([p.mode, labels, p.center, p.seed]);
}

export const storyFitCount = (nodes: readonly NodeFieldNode[] | undefined): number =>
  nodes?.length || STORY_DEFAULT_FITS;

function makeNode(x: number, y: number, rand: () => number): FieldNode {
  return {
    x,
    y,
    size: 1.5 + rand() * 1.3,
    alpha: 0.42 + rand() * 0.36,
    phase: rand() * TAU,
    speed: 0.5 + rand() * 1.2,
    state: "idle",
    t0: 0,
    hidden: false,
  };
}

function placeNamedNodes(
  nodes: readonly NodeFieldNode[],
  field: FieldLayout,
  masks: readonly MaskRect[],
): NamedNode[] {
  const { center, radii, width, height } = field;
  const picked: Point[] = [];
  for (const radius of [radii[2], radii[3], radii[1]]) {
    for (const deg of NAMED_ANGLES) {
      if (picked.length >= nodes.length) break;
      const a = (deg * Math.PI) / 180;
      const x = center.x + Math.cos(a) * radius;
      const y = center.y + Math.sin(a) * radius * 0.82;
      const outside = x < EDGE || x > width - EDGE || y < EDGE || y > height - EDGE * 2;
      if (outside || isInMask(masks, x, y, EDGE * 0.75)) continue;
      if (picked.some((p) => Math.hypot(p.x - x, p.y - y) < NAMED_MIN_GAP)) continue;
      picked.push({ x, y });
    }
  }
  const rand = mulberry32(DEFAULT_SEED);
  return nodes.map((node, i) => {
    const spot = picked[i];
    return {
      ...makeNode(spot?.x ?? center.x, spot?.y ?? center.y, rand),
      ...node,
      size: NAMED_NODE_SIZE,
      hidden: !spot,
    };
  });
}

function buildStoryParticles(
  fits: number,
  field: FieldLayout,
  isNarrow: boolean,
  rand: () => number,
): StoryParticle[] {
  const { center, width, height } = field;
  const fitRadius = Math.min(width * (isNarrow ? 0.38 : 0.2), height * (isNarrow ? 0.2 : 0.3), 300);
  return Array.from({ length: isNarrow ? STORY_COUNT.narrow : STORY_COUNT.wide }, (_, i) => {
    const a = rand() * TAU;
    const spread = Math.pow(rand(), 0.6);
    const fitAngle = -0.55 + (i / fits) * TAU + (rand() - 0.5) * 0.2;
    const fitR = fitRadius * (0.75 + rand() * 0.45);
    return {
      homeX: center.x + Math.cos(a) * spread * Math.max(width, 600) * 0.7,
      homeY: center.y + Math.sin(a) * spread * Math.max(height, 600) * 0.62,
      fitX: center.x + Math.cos(fitAngle) * fitR * 1.35,
      fitY: center.y + Math.sin(fitAngle) * fitR,
      size: 0.7 + rand() * 1.5,
      alpha: i < fits ? 0.9 : 0.22 + rand() * 0.55,
      phase: rand() * TAU,
      speed: 0.5 + rand() * 1.6,
    };
  });
}

export function buildFieldLayout(
  p: NodeFieldProps,
  width: number,
  height: number,
  masks: readonly MaskRect[],
): FieldLayout {
  const centerFraction = p.center ?? DEFAULT_CENTER;
  const center = { x: width * centerFraction.x, y: height * centerFraction.y };
  const reach = Math.max(Math.min(width, height * 1.1), MIN_REACH);
  const radii = RING_FRACTIONS.map((f) => f * reach);
  const rand = mulberry32(p.seed ?? DEFAULT_SEED);
  const isNarrow = width < NARROW_WIDTH;

  const dust = Array.from(
    { length: Math.round((width * height) / (isNarrow ? DUST_AREA.narrow : DUST_AREA.wide)) },
    () => ({
      ...makeNode(rand() * width, rand() * height, rand),
      size: 0.7 + rand() * 1.1,
      alpha: 0.1 + rand() * 0.3,
    }),
  );
  const ring = Array.from({ length: RING_NODE_COUNT }, (_, i) => {
    const a = rand() * TAU;
    const r = radii[i % radii.length] + (rand() - 0.5) * reach * 0.07;
    const node = makeNode(center.x + Math.cos(a) * r, center.y + Math.sin(a) * r, rand);
    return { ...node, hidden: isInMask(masks, node.x, node.y, RING_MASK_MARGIN) };
  });

  const field: FieldLayout = { width, height, center, radii, ring, dust, story: [], named: [] };
  if (p.mode === "research") field.named = placeNamedNodes(p.nodes, field, masks);
  if (p.mode === "story")
    field.story = buildStoryParticles(storyFitCount(p.nodes), field, isNarrow, rand);
  return field;
}
