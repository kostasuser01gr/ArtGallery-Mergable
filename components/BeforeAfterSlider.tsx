"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
};

export function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"slider" | "heatmap">("slider");
  const [heatmapReady, setHeatmapReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current || mode === "heatmap") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, [mode]);

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    const handleMove = (e: MouseEvent) => isDragging && handlePointerMove(e.clientX);
    
    if (isDragging) {
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("mousemove", handleMove);
    }
    
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isDragging, handlePointerMove]);

  // Generate Heatmap
  useEffect(() => {
    if (mode !== "heatmap") return;
    
    const generateHeatmap = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
      });

      try {
        setHeatmapReady(false);
        const [img1, img2] = await Promise.all([loadImg(before), loadImg(after)]);
        
        // Use a standard internal resolution for diffing
        const w = 800;
        const h = 450;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img1, 0, 0, w, h);
        const data1 = ctx.getImageData(0, 0, w, h).data;
        
        ctx.clearRect(0, 0, w, h);
        
        ctx.drawImage(img2, 0, 0, w, h);
        const data2 = ctx.getImageData(0, 0, w, h).data;

        const result = ctx.createImageData(w, h);

        for (let i = 0; i < data1.length; i += 4) {
          const diff = Math.abs(data1[i] - data2[i]) + 
                       Math.abs(data1[i+1] - data2[i+1]) + 
                       Math.abs(data1[i+2] - data2[i+2]);
          
          const intensity = Math.min(255, diff);
          
          // Thermal mapping (Black -> Blue -> Red -> Yellow -> White)
          if (intensity < 10) {
            result.data[i] = 2; result.data[i+1] = 3; result.data[i+2] = 6; // Dark bg
          } else if (intensity < 50) {
            result.data[i] = 0; result.data[i+1] = intensity * 2; result.data[i+2] = intensity * 4; // Blueish
          } else if (intensity < 150) {
            result.data[i] = intensity * 1.5; result.data[i+1] = 0; result.data[i+2] = 0; // Redish
          } else {
            result.data[i] = 255; result.data[i+1] = intensity; result.data[i+2] = 0; // Yellow/White
          }
          result.data[i+3] = 255; // Alpha
        }

        ctx.putImageData(result, 0, 0);
        setHeatmapReady(true);
      } catch (err) {
        console.error("Heatmap generation failed", err);
      }
    };

    void generateHeatmap();
  }, [mode, before, after]);

  return (
    <div className="group relative space-y-3">
      {/* Controls */}
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <div className="flex rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
          <button
            onClick={() => setMode("slider")}
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              mode === "slider" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Slider
          </button>
          <button
            onClick={() => setMode("heatmap")}
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              mode === "heatmap" ? "bg-red-500/30 text-red-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 select-none ${
          mode === "slider" ? "cursor-ew-resize" : ""
        }`}
        onMouseDown={(e) => {
          if (mode === "slider") {
            setIsDragging(true);
            handlePointerMove(e.clientX);
          }
        }}
        onTouchStart={() => mode === "slider" && setIsDragging(true)}
        onTouchMove={(e) => isDragging && handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {mode === "slider" ? (
          <>
            <Image src={before} alt="Before" fill className="object-cover" />
            
            <div
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ width: `${100 - position}%` }}
            >
              <div className="absolute inset-y-0 right-0 h-full" style={{ width: '100vw' }}>
                 <Image src={after} alt="After" fill className="object-cover object-right" />
              </div>
            </div>
            
            {/* Slider Line */}
            <div
              className="absolute inset-y-0 w-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ left: `${position}%` }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400 bg-black/50 backdrop-blur-md transition-transform group-hover:scale-110">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                </svg>
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-md pointer-events-none">
              Raw
            </div>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-md pointer-events-none">
              Composite
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black">
            {!heatmapReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">Analyzing Diff...</span>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className={`h-full w-full object-cover transition-opacity duration-500 ${heatmapReady ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Heatmap Legend */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md">
               <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Unchanged</span>
               <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-900 via-red-500 to-yellow-300" />
               <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Modified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
