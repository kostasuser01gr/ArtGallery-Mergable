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
  cinematicMode?: boolean;
};

function normalizeAsset(file: string) {
  return file.startsWith("/") ? file : `/assets/${file}`;
}

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imageCache.set(src, image);
      resolve(image);
    };
    image.onerror = (err) => {
      console.error(`Failed to load image: ${src}`, err);
      reject(err);
    };
    image.src = src;
  });
}

function applyChromaticAberration(
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  intensity: number
) {
  if (intensity < 0.01) {
    ctx.drawImage(image, x, y, w, h);
    return;
  }

  const offset = intensity * 4;
  
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  // Red channel
  ctx.globalAlpha = 1.0;
  ctx.filter = "matrix(1, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 1, 0)";
  ctx.drawImage(image, x - offset, y, w, h);
  
  // Green channel
  ctx.filter = "matrix(0, 0, 0, 0, 0,  0, 1, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 1, 0)";
  ctx.drawImage(image, x, y, w, h);
  
  // Blue channel
  ctx.filter = "matrix(0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 1, 0, 0,  0, 0, 0, 1, 0)";
  ctx.drawImage(image, x + offset, y, w, h);
  
  ctx.restore();
}

function drawFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const count = Math.floor((width * height) / 3200);
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${0.04 * intensity})`;
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
    width / 2, height / 2, width * 0.2,
    width / 2, height / 2, width * 0.75
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${opacity * 1.2})`);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
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
  cinematicMode = true,
}: LayerStackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  
  const progressRef = useRef(progress);
  const pointerRef = useRef(pointer);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { pointerRef.current = pointer; }, [pointer]);

  const sourcePaths = useMemo(() => sources.map(s => normalizeAsset(s.file)), [sources]);
  const finalPath = useMemo(() => normalizeAsset(finalComposite), [finalComposite]);

  useEffect(() => {
    let rafId = 0;
    let isCancelled = false;

    const initialize = async () => {
      try {
        setIsReady(false);
        const [loadedSources, loadedFinal] = await Promise.all([
          Promise.all(sourcePaths.map(loadImage)),
          loadImage(finalPath),
        ]);

        if (isCancelled) return;
        setIsReady(true);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const render = () => {
          if (isCancelled) return;

          const timeline = getTimelineState(progressRef.current);
          const livePointer = pointerRef.current;

          ctx.fillStyle = "#020306";
          ctx.fillRect(0, 0, width, height);

          loadedSources.forEach((image, index) => {
            const layer = getLayerState(index, loadedSources.length, timeline);
            const parallax = calculateParallaxOffset(
              reducedMotion ? 0 : livePointer.x,
              reducedMotion ? 0 : livePointer.y,
              { x: layer.x, y: layer.y, depth: layer.depth }
            );

            const imgW = width * 0.68;
            const imgH = height * 0.68;
            const drawX = width * 0.5 - imgW * 0.5 + parallax.x;
            const drawY = height * 0.5 - imgH * 0.5 + parallax.y;

            ctx.save();
            ctx.globalAlpha = layer.opacity;
            
            if (["merge", "final", "blueprint"].includes(timeline.phase)) {
              const radius = Math.max(width, height) * (0.15 + layer.maskProgress * 0.95);
              ctx.beginPath();
              const jitter = Math.sin(index * 2.3 + progressRef.current * 14) * 8;
              ctx.arc(width * 0.5 + jitter, height * 0.5, radius, 0, Math.PI * 2);
              ctx.clip();
            }

            const alphaMask = radialMaskAlpha(
              drawX + imgW / 2, drawY + imgH / 2, layer.maskProgress, width, height
            );
            ctx.globalAlpha *= 0.4 + alphaMask * 0.6;
            
            if (cinematicMode) {
              const aberration = (1 - layer.maskProgress) * 0.002 * (1 + Math.sin(progressRef.current * 10) * 0.5);
              applyChromaticAberration(ctx, image, drawX, drawY, imgW, imgH, aberration);
            } else {
              ctx.drawImage(image, drawX, drawY, imgW, imgH);
            }
            
            ctx.restore();
          });

          const finalBlend = (timeline.phase === "final" || timeline.phase === "blueprint")
            ? Math.min(1, (timeline.progress - 0.82) / 0.18) : 0;
              
          if (finalBlend > 0) {
            ctx.save();
            ctx.globalAlpha = finalBlend;
            if (cinematicMode) {
              ctx.filter = `blur(${Math.max(0, (1 - finalBlend) * 10)}px) brightness(${1 + timeline.bloom * 2}) contrast(1.1)`;
            }
            ctx.drawImage(loadedFinal, width * 0.12, height * 0.1, width * 0.76, height * 0.8);
            ctx.restore();
          }

          drawFilmGrain(ctx, width, height, 1 - (reducedMotion ? 0.6 : 0));
          drawVignette(ctx, width, height, timeline.vignette);

          rafId = requestAnimationFrame(render);
        };

        render();
      } catch (e) { console.error(e); }
    };

    void initialize();
    return () => { isCancelled = true; cancelAnimationFrame(rafId); };
  }, [blueprint, finalPath, height, reducedMotion, sourcePaths, width, cinematicMode]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/5">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading High-Res Engine</span>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPointer({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        className="h-full w-full cursor-crosshair object-cover"
      />
    </div>
  );
}
