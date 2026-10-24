import { FADE_TIME, LIGHT_EVERY, MAX_LIT, PROBE_EVERY, PROBE_LIFE } from "./node-field.constants";
import type {
  FieldActivity,
  FieldNode,
  NamedNode,
  NodeFieldProps,
  NodeState,
  SavedNodeState,
} from "./node-field.types";

const LIGHT_CANDIDATES = 6;

export const createFieldActivity = (): FieldActivity => ({
  probes: [],
  lit: [],
  lastProbe: 0,
  lastLight: 0,
});

export function resetFieldActivity(activity: FieldActivity): void {
  activity.probes = [];
  activity.lit = [];
}

const idleRingNodes = (ring: readonly FieldNode[]): FieldNode[] =>
  ring.filter((n) => !n.hidden && n.state === "idle");

const pickRandom = <T>(pool: readonly T[]): T => pool[Math.floor(Math.random() * pool.length)];

/** Lights an idle ring node far from the ones already lit, fading the oldest past MAX_LIT. */
export function lightNextRingNode(
  activity: FieldActivity,
  ring: readonly FieldNode[],
  stamp: number,
): void {
  const pool = idleRingNodes(ring);
  if (!pool.length) return;
  let best = pool[0];
  let bestGap = -1;
  for (let k = 0; k < LIGHT_CANDIDATES; k++) {
    const candidate = pickRandom(pool);
    const gap = Math.min(
      Infinity,
      ...activity.lit.map((l) => Math.hypot(l.x - candidate.x, l.y - candidate.y)),
    );
    if (gap > bestGap) [best, bestGap] = [candidate, gap];
  }
  best.state = "lit";
  best.t0 = stamp;
  activity.lit.push(best);
  while (activity.lit.length > MAX_LIT) {
    const old = activity.lit.shift();
    if (old) [old.state, old.t0] = ["fade", stamp];
  }
}

/** Spawns probes and, in ambient mode, lights the next ring node when each is due. */
export function advanceFieldActivity(
  activity: FieldActivity,
  ring: readonly FieldNode[],
  p: NodeFieldProps,
  time: number,
  stamp: number,
): void {
  const isScanning =
    p.mode === "research" ? p.activeIndex >= 0 && p.activeIndex < p.nodes.length : true;
  const every = p.mode === "research" ? PROBE_EVERY.research : PROBE_EVERY.ambient;
  if (isScanning && time - activity.lastProbe > every) {
    activity.lastProbe = time;
    const pool = idleRingNodes(ring);
    if (pool.length) activity.probes.push({ node: pickRandom(pool), t0: time });
  }
  if (p.mode === "ambient" && time - activity.lastLight > LIGHT_EVERY) {
    activity.lastLight = time;
    lightNextRingNode(activity, ring, stamp);
  }
}

export function pruneProbes(activity: FieldActivity, time: number): void {
  activity.probes = activity.probes.filter((pr) => time - pr.t0 < PROBE_LIFE);
}

export function settleFadedNodes(ring: readonly FieldNode[], motionTime: number): void {
  for (const n of ring) if (n.state === "fade" && motionTime - n.t0 >= FADE_TIME) n.state = "idle";
}

/** Moves named nodes to done / scanning / idle around activeIndex, keeping
 * each node's start time across relayouts so transitions don't restart. */
export function applyResearchProgress(
  named: readonly NamedNode[],
  saved: SavedNodeState[],
  activeIndex: number,
  stamp: number,
): void {
  named.forEach((n, i) => {
    const want: NodeState = i < activeIndex ? "lit" : i === activeIndex ? "scan" : "idle";
    const current = (saved[i] ??= { state: "idle", t0: 0 });
    if (current.state !== want) [current.state, current.t0] = [want, stamp];
    [n.state, n.t0] = [current.state, current.t0];
  });
}
