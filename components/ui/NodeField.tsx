"use client";

import { useEffect, useRef } from "react";

import { drawAmbient } from "@/lib/node-field/draw-ambient";
import { drawMasks } from "@/lib/node-field/draw-masks";
import { drawResearch } from "@/lib/node-field/draw-research";
import { drawStory } from "@/lib/node-field/draw-story";
import {
  advanceFieldActivity,
  applyResearchProgress,
  createFieldActivity,
  lightNextRingNode,
  pruneProbes,
  resetFieldActivity,
  settleFadedNodes,
} from "@/lib/node-field/field-activity";
import { buildFieldLayout, layoutKey } from "@/lib/node-field/field-layout";
import { measureMasks } from "@/lib/node-field/mask-geometry";
import { MAX_DPR, MAX_LIT, RESOLVED } from "@/lib/node-field/node-field.constants";
import type {
  FieldLayout,
  MaskRect,
  NodeFieldProps,
  SavedNodeState,
  SceneFrame,
} from "@/lib/node-field/node-field.types";
import { readPalette } from "@/lib/node-field/palette";
import { THEME_ATTRIBUTE } from "@/lib/theme/theme.constants";

export type {
  NodeFieldMask,
  NodeFieldNode,
  NodeFieldProps,
} from "@/lib/node-field/node-field.types";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Canvas renderer for the node field behind the story, auth and onboarding
 * launch. Fills its nearest positioned ancestor; colours come from the theme
 * tokens and refresh when the theme changes. Pauses off-screen and in hidden
 * tabs, and draws one still frame under prefers-reduced-motion. */
export function NodeField(props: NodeFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  const syncRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    let palette = readPalette();
    let dpr = 1;
    let field: FieldLayout | null = null;
    let masks: MaskRect[] = [];
    const activity = createFieldActivity();
    const researchStates: SavedNodeState[] = [];
    let currentKey = "";
    let isRunning = false;
    let isOnScreen = true;
    let frame = 0;

    const now = () => performance.now() / 1000;
    const stamp = () => (isReduced ? RESOLVED : now());
    const remeasureMasks = () =>
      (masks = measureMasks(canvas.getBoundingClientRect(), propsRef.current.masks ?? []));

    function layout() {
      const p = propsRef.current;
      const box = canvas!.getBoundingClientRect();
      const width = Math.max(1, box.width);
      const height = Math.max(1, box.height);
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      remeasureMasks();
      field = buildFieldLayout(p, width, height, masks);
      resetFieldActivity(activity);
      if (p.mode === "ambient")
        for (let i = 0; i < MAX_LIT; i++) lightNextRingNode(activity, field.ring, stamp());
    }

    function draw() {
      if (!field || field.width < 2) return;
      const p = propsRef.current;
      const time = now();
      const motionTime = isReduced ? 0 : time;
      remeasureMasks();
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scene: SceneFrame = { ctx: ctx!, palette, field, masks, time, motionTime };
      if (p.mode === "story") drawStory(scene, p);
      else {
        if (isRunning) advanceFieldActivity(activity, field.ring, p, time, stamp());
        pruneProbes(activity, time);
        if (p.mode === "research") drawResearch(scene, activity);
        else drawAmbient(scene, activity);
        settleFadedNodes(field.ring, motionTime);
      }
      ctx!.globalAlpha = 1;
      drawMasks(ctx!, masks, dpr);
    }

    function tick() {
      if (!isRunning) return;
      draw();
      frame = requestAnimationFrame(tick);
    }

    function updateRunning() {
      const shouldRun = isOnScreen && !document.hidden && !isReduced;
      if (shouldRun === isRunning) return;
      isRunning = shouldRun;
      if (isRunning) frame = requestAnimationFrame(tick);
      else cancelAnimationFrame(frame);
    }

    function sync() {
      const p = propsRef.current;
      const key = layoutKey(p);
      if (key !== currentKey) {
        currentKey = key;
        researchStates.length = 0;
        layout();
      }
      if (p.mode === "research" && field)
        applyResearchProgress(field.named, researchStates, p.activeIndex, stamp());
      if (!isRunning) draw();
    }

    syncRef.current = sync;
    sync();

    const resize = new ResizeObserver(() => {
      layout();
      sync();
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver((entries) => {
      isOnScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      updateRunning();
    });
    visibility.observe(canvas);
    const theme = new MutationObserver(() => {
      palette = readPalette();
      if (!isRunning) draw();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [THEME_ATTRIBUTE],
    });
    document.addEventListener("visibilitychange", updateRunning);
    updateRunning();

    return () => {
      isRunning = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", updateRunning);
      syncRef.current = () => undefined;
    };
  }, []);

  // Every render: progress and activeIndex are meant to change often, and a
  // sync with nothing new is one cheap comparison plus, when paused, one frame.
  useEffect(() => {
    propsRef.current = props;
    syncRef.current();
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${props.className ?? ""}`}
    />
  );
}
