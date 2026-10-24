import type { RefObject } from "react";

export interface NodeFieldNode {
  label: string;
  /** Shown after the label once the node is done, e.g. a fit score. */
  detail?: string;
}

/** An element the field fades out under, so text and cards on top stay clean. */
export interface NodeFieldMask {
  target: RefObject<HTMLElement | null>;
  padding?: number;
  feather?: number;
  radius?: number;
}

export interface StoryModeProps {
  mode: "story";
  progress: number;
  nodes?: readonly NodeFieldNode[];
}

export interface ResearchModeProps {
  mode: "research";
  nodes: readonly NodeFieldNode[];
  activeIndex: number;
}

type ModeProps =
  /** Rings of companies around a centre, quietly probed and lit in turn. */
  | { mode: "ambient" }
  /** A scattered field that gathers (progress 0 to 0.4) and filters down to
   * the fits (0.4 to 1). `nodes` names the fits. */
  | StoryModeProps
  /** Named nodes researched in order: before activeIndex done, at it scanning. */
  | ResearchModeProps;

export type NodeFieldProps = ModeProps & {
  /** Centre node position as fractions of the canvas. */
  center?: Point;
  masks?: readonly NodeFieldMask[];
  seed?: number;
  className?: string;
};

export interface Point {
  x: number;
  y: number;
}

export type NodeState = "idle" | "scan" | "lit" | "fade";

export interface FieldNode extends Point {
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  state: NodeState;
  t0: number;
  hidden: boolean;
}

export type NamedNode = FieldNode & NodeFieldNode;

export interface SavedNodeState {
  state: NodeState;
  t0: number;
}

export interface StoryParticle {
  homeX: number;
  homeY: number;
  fitX: number;
  fitY: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

export interface FieldLayout {
  width: number;
  height: number;
  center: Point;
  radii: number[];
  ring: FieldNode[];
  dust: FieldNode[];
  story: StoryParticle[];
  named: NamedNode[];
}

export interface Probe {
  node: FieldNode;
  t0: number;
}

export interface FieldActivity {
  probes: Probe[];
  lit: FieldNode[];
  lastProbe: number;
  lastLight: number;
}

export interface MaskRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  feather: number;
}

export interface Palette {
  node: string;
  fit: string;
  core: string;
  teal: string;
  text: string;
  muted: string;
  font: string;
  isLight: boolean;
}

/** Everything one frame of drawing reads. `motionTime` is frozen at 0 under
 * prefers-reduced-motion; `time` is the wall clock in seconds. */
export interface SceneFrame {
  ctx: CanvasRenderingContext2D;
  palette: Palette;
  field: FieldLayout;
  masks: readonly MaskRect[];
  time: number;
  motionTime: number;
}
