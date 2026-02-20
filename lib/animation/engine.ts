import { clamp, easeInOutCubic } from "./easing";

export type AnimationPhase =
  | "intro"
  | "fragments"
  | "parallax"
  | "merge"
  | "final"
  | "blueprint";

export type LayerState = {
  index: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  depth: number;
  maskProgress: number;
};

export type TimelineState = {
  phase: AnimationPhase;
  progress: number;
  bloom: number;
  vignette: number;
};

const phaseBoundaries = [0, 0.12, 0.35, 0.62, 0.82, 0.95, 1] as const;

function getPhase(progress: number): AnimationPhase {
  if (progress < phaseBoundaries[1]) return "intro";
  if (progress < phaseBoundaries[2]) return "fragments";
  if (progress < phaseBoundaries[3]) return "parallax";
  if (progress < phaseBoundaries[4]) return "merge";
  if (progress < phaseBoundaries[5]) return "final";
  return "blueprint";
}

export function getTimelineState(rawProgress: number): TimelineState {
  const progress = clamp(rawProgress);
  const phase = getPhase(progress);

  return {
    phase,
    progress,
    bloom: phase === "final" || phase === "blueprint" ? 0.25 : 0.08,
    vignette: phase === "intro" ? 0.12 : 0.28,
  };
}

export function getLayerState(
  layerIndex: number,
  totalLayers: number,
  timeline: TimelineState,
): LayerState {
  const localDelay = layerIndex / Math.max(totalLayers, 1) * 0.18;
  const staged = clamp((timeline.progress - localDelay) / (1 - localDelay));
  const merged = timeline.phase === "merge" || timeline.phase === "final" || timeline.phase === "blueprint";
  const reveal = merged ? easeInOutCubic(clamp((timeline.progress - 0.62) / 0.25)) : 0;

  return {
    index: layerIndex,
    x: Math.sin((layerIndex + 1) * 0.6 + timeline.progress * 6) * (merged ? 4 : 18),
    y: Math.cos((layerIndex + 1) * 0.5 + timeline.progress * 4) * (merged ? 3 : 14),
    scale: merged ? 1 : 0.84 + staged * 0.22,
    opacity: timeline.phase === "intro" ? staged * 0.6 : 0.5 + staged * 0.5,
    depth: 0.1 + (layerIndex / Math.max(totalLayers, 1)) * 0.6,
    maskProgress: reveal,
  };
}

export type SharedAnimationConfig = {
  totalFrames: number;
  fps: number;
};

export const defaultAnimationConfig: SharedAnimationConfig = {
  totalFrames: 360,
  fps: 30,
};
