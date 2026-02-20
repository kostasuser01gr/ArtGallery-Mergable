import { clamp } from "@/lib/animation/easing";

export function radialMaskAlpha(
  x: number,
  y: number,
  progress: number,
  width: number,
  height: number,
) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const dx = x - cx;
  const dy = y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = Math.sqrt(cx * cx + cy * cy);
  const threshold = maxDistance * clamp(progress);
  const softness = 24;
  return clamp((threshold + softness - distance) / softness);
}
