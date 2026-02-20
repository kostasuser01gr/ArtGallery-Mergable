import { clamp } from "./easing";

export type ParallaxState = {
  x: number;
  y: number;
  depth: number;
};

export function calculateParallaxOffset(
  pointerX: number,
  pointerY: number,
  state: ParallaxState,
) {
  const strength = clamp(state.depth, 0, 1) * 28;
  return {
    x: state.x + pointerX * strength,
    y: state.y + pointerY * strength,
  };
}
