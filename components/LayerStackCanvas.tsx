"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getLayerState, getTimelineState } from "@/lib/animation/engine";
import { radialMaskAlpha } from "@/components/MaskReveal";
import { calculateParallaxOffset } from "@/lib/animation/parallax";

export type CanvasLayer = {
  file: string;
  depth: number;
  label: string;
};

type LayerStackCanvasProps = {
  width?: number;
  height?: number;
  sources: CanvasLayer[];
  finalComposite: string;
  progress: number;
  reducedMotion: boolean;
  blueprint?: string[];
};

function normalizeAsset(file: string) {
  return file.startsWith("/") ? file : `/assets/${file}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const count = Math.floor((width * height) / 3200);
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${0.04 * intensity})`;
  for (let i = 0; i < count; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.6;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.2,
    width / 2,
    height / 2,
    width * 0.65,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(0,0,0,${opacity})`);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawBlueprint(ctx: CanvasRenderingContext2D, width: number, height: number, lines: string[]) {
  ctx.save();
  ctx.strokeStyle = "rgba(140, 220, 255, 0.22)";
  ctx.lineWidth = 1;

  const grid = 40;
  for (let x = 0; x <= width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(140, 220, 255, 0.7)";
  ctx.font = "12px Menlo, monospace";
  lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, 16, 24 + index * 18);
  });
  ctx.restore();
}

export function LayerStackCanvas({
  width = 1280,
  height = 720,
  sources,
  finalComposite,
  progress,
  reducedMotion,
  blueprint,
}: LayerStackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const progressRef = useRef(progress);
  const pointerRef = useRef(pointer);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  const sourcePaths = useMemo(
    () => sources.map((source) => normalizeAsset(source.file)),
    [sources],
  );

  useEffect(() => {
    let raf = 0;
    let disposed = false;

    const run = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        return;
      }

      const images = await Promise.all(sourcePaths.map((path) => loadImage(path)));
      const finalImage = await loadImage(normalizeAsset(finalComposite));

      const loop = () => {
        if (disposed) {
          return;
        }

        const timeline = getTimelineState(progressRef.current);
        const livePointer = pointerRef.current;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#020307";
        ctx.fillRect(0, 0, width, height);

        images.forEach((image, index) => {
          const layer = getLayerState(index, images.length, timeline);
          const parallax = calculateParallaxOffset(
            reducedMotion ? 0 : livePointer.x,
            reducedMotion ? 0 : livePointer.y,
            {
              x: layer.x,
              y: layer.y,
              depth: layer.depth,
            },
          );

          const imageWidth = width * 0.66;
          const imageHeight = height * 0.66;
          const drawX = width * 0.5 - imageWidth * 0.5 + parallax.x;
          const drawY = height * 0.5 - imageHeight * 0.5 + parallax.y;

          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.translate(drawX + imageWidth / 2, drawY + imageHeight / 2);
          ctx.scale(layer.scale, layer.scale);
          ctx.translate(-(drawX + imageWidth / 2), -(drawY + imageHeight / 2));

          if (
            timeline.phase === "merge" ||
            timeline.phase === "final" ||
            timeline.phase === "blueprint"
          ) {
            const radius = Math.max(width, height) * (0.2 + layer.maskProgress * 0.9);
            ctx.beginPath();
            const jitter = Math.sin(index * 2.3 + progressRef.current * 14) * 12;
            ctx.arc(width * 0.5 + jitter, height * 0.5, radius, 0, Math.PI * 2);
            ctx.clip();
          }

          const alphaMask = radialMaskAlpha(
            drawX + imageWidth / 2,
            drawY + imageHeight / 2,
            layer.maskProgress,
            width,
            height,
          );
          ctx.globalAlpha *= 0.35 + alphaMask * 0.65;
          ctx.drawImage(image, drawX, drawY, imageWidth, imageHeight);
          ctx.restore();
        });

        const finalBlend =
          timeline.phase === "final" || timeline.phase === "blueprint"
            ? (timeline.progress - 0.82) / 0.18
            : 0;
        if (finalBlend > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, finalBlend);
          ctx.filter = `brightness(${1 + timeline.bloom}) saturate(1.08)`;
          ctx.drawImage(finalImage, width * 0.14, height * 0.12, width * 0.72, height * 0.76);
          ctx.restore();
        }

        drawFilmGrain(ctx, width, height, 1 - Number(reducedMotion) * 0.4);
        drawVignette(ctx, width, height, timeline.vignette);

        if (timeline.phase === "blueprint" && blueprint?.length) {
          drawBlueprint(ctx, width, height, blueprint);
        }

        raf = requestAnimationFrame(loop);
      };

      loop();
    };

    void run();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [blueprint, finalComposite, height, reducedMotion, sourcePaths, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setPointer({ x, y });
      }}
      className="h-auto w-full rounded-2xl border border-white/10 bg-black"
    />
  );
}
