"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { LayerStackCanvas } from "@/components/LayerStackCanvas";
import { useReducedMotionPreference } from "@/components/ReducedMotionProvider";
import { getTimelineState } from "@/lib/animation/engine";
import { manifest } from "@/lib/assets/manifest";
import { soundscape } from "@/lib/audio/SoundscapeEngine";

type ScenePlayerProps = {
  blueprint?: string[];
  autoplay?: boolean;
  loop?: boolean;
  compact?: boolean;
};

export function ScenePlayer({
  blueprint,
  autoplay = true,
  loop = true,
  compact = false,
}: ScenePlayerProps) {
  const reducedMotion = useReducedMotionPreference();
  const [playing, setPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fps, setFps] = useState(0);
  
  const lastUpdateRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef<number>(0);

  const togglePlayback = useCallback(() => {
    setPlaying((p) => {
      if (!p && audioEnabled) soundscape?.init();
      return !p;
    });
  }, [audioEnabled]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (next) {
        soundscape?.init();
      } else {
        // Just let it mute via update loop
      }
      return next;
    });
  }, []);

  const scrub = useCallback((next: number) => {
    setProgress(Math.max(0, Math.min(1, next)));
    setPlaying(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayback();
      } else if (e.code === "ArrowLeft") {
        scrub(progress - 0.05);
      } else if (e.code === "ArrowRight") {
        scrub(progress + 0.05);
      } else if (e.code === "KeyM") {
        toggleAudio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [progress, scrub, togglePlayback, toggleAudio]);

  useEffect(() => {
    if (!playing) {
      lastUpdateRef.current = null;
      soundscape?.update(progress, getTimelineState(progress).phase, false);
      return;
    }

    let rafId = 0;
    const duration = reducedMotion ? 4000 : 9000;

    const tick = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      if (!lastFpsTimeRef.current) lastFpsTimeRef.current = timestamp;
      
      const elapsed = timestamp - lastUpdateRef.current;
      const step = elapsed / duration;
      
      let currentProgress = 0;
      setProgress((prev) => {
        const next = prev + step;
        currentProgress = loop ? next % 1 : Math.min(1, next);
        return currentProgress;
      });

      // Update Audio Engine
      if (audioEnabled) {
        const phase = getTimelineState(currentProgress).phase;
        soundscape?.update(currentProgress, phase, true);
      } else {
        soundscape?.update(currentProgress, getTimelineState(currentProgress).phase, false);
      }

      // FPS Calc
      frameCountRef.current++;
      if (timestamp - lastFpsTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = timestamp;
      }

      lastUpdateRef.current = timestamp;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [loop, playing, reducedMotion, audioEnabled, progress]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => soundscape?.stop();
  }, []);

  const sources = useMemo(() => manifest.sources.map((entry) => ({ ...entry })), []);
  const timeline = getTimelineState(progress);

  return (
    <div className="group relative space-y-4">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.005]">
        <LayerStackCanvas
          width={compact ? 960 : 1280}
          height={compact ? 540 : 720}
          sources={sources}
          finalComposite={manifest.finalComposite}
          progress={progress}
          reducedMotion={reducedMotion}
          blueprint={blueprint}
        />
        
        {/* Performance Telemetry HUD */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-400">Telemetry</span>
            <div className="flex gap-3">
               <span className="font-mono text-[10px] text-white">FPS: {fps > 0 ? fps : '--'}</span>
               <span className="font-mono text-[10px] text-white">Layers: {sources.length}</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-5 backdrop-blur-xl shadow-2xl transition-colors hover:border-white/10">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            aria-label={playing ? "Pause animation" : "Play animation"}
          >
            {playing ? (
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="h-5 w-5 translate-x-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleAudio}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all active:scale-95 ${
              audioEnabled 
                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                : "border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10"
            }`}
            title="Toggle Spatial Audio (M)"
          >
             {audioEnabled ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2l4 4V4L9 8H7a2 2 0 00-2 2z" /></svg>
             ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.586l-1.293-1.293a1 1 0 011.414-1.414l11 11a1 1 0 01-1.414 1.414L15 12.414V19a1 1 0 01-1 1h-1.586l-1.293 1.293a1 1 0 01-1.414-1.414L5.586 15z" /></svg>
             )}
          </button>

          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={Math.round(progress * 1000)}
              onChange={(e) => scrub(Number(e.target.value) / 1000)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400 outline-none transition-all hover:bg-white/20"
              aria-label="Timeline progress scrubber"
            />
            <div 
              className="pointer-events-none absolute left-0 top-0 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="w-20 text-right font-mono text-base font-medium tracking-tight text-cyan-300 tabular-nums">
            {Math.round(progress * 100)}%
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          <div className="flex gap-6">
            <span className={`transition-colors ${timeline.phase === 'fragments' || timeline.phase === 'intro' ? "text-cyan-400" : ""}`}>Fragments</span>
            <span className={`transition-colors ${timeline.phase === 'parallax' ? "text-cyan-400" : ""}`}>Parallax</span>
            <span className={`transition-colors ${timeline.phase === 'merge' ? "text-cyan-400" : ""}`}>Merge</span>
            <span className={`transition-colors ${timeline.phase === 'final' || timeline.phase === 'blueprint' ? "text-cyan-400" : ""}`}>Final</span>
          </div>
          <div className="hidden sm:block">
            {playing ? <span className="text-emerald-400 animate-pulse">Engine Active</span> : "Engine Standby"}
          </div>
        </div>
      </div>
    </div>
  );
}
