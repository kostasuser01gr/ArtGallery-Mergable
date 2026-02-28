"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CAMERAS = ["CAM-01: SOUTH WING", "CAM-02: ROOFTOP", "CAM-03: INNER CORE", "CAM-04: LOADING BAY"];

export function LiveMonitor() {
  const [activeCam, setActiveCam] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const camInterval = setInterval(() => {
      setActiveCam((prev) => (prev + 1) % CAMERAS.length);
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 8000);

    return () => clearInterval(camInterval);
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/5 bg-zinc-950 shadow-2xl">
      {/* Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCam}
          initial={{ opacity: 0 }}
          animate={{ opacity: glitch ? 0.5 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full"
        >
          {/* Simulated Camera Feed Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
          
          {/* Subject Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative h-64 w-96 border border-white/10 opacity-20">
                <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-cyan-500" />
                <div className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-cyan-500" />
                <div className="absolute -left-2 -bottom-2 h-4 w-4 border-l-2 border-b-2 border-cyan-500" />
                <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-cyan-500" />
             </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-8xl font-black uppercase tracking-tighter text-white/5 select-none">
              {CAMERAS[activeCam].split(":")[0]}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* HUD Overlays */}
      <div className="absolute inset-0 z-30 p-6 pointer-events-none font-mono">
        {/* Top Left */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Recording</span>
          </div>
          <span className="text-[10px] text-zinc-500">{CAMERAS[activeCam]}</span>
        </div>

        {/* Top Right */}
        <div className="absolute right-6 top-6 flex flex-col items-end gap-1">
          <span className="text-[10px] text-zinc-400">2026-02-28</span>
          <span className="text-[10px] text-zinc-400">LAT: 37.7749° N</span>
          <span className="text-[10px] text-zinc-400">LON: 122.4194° W</span>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-6 left-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 text-[8px] text-cyan-500 font-bold uppercase tracking-widest">
              <span>Bitrate: 12.4 Mbps</span>
              <span>Temp: 24.2°C</span>
            </div>
            <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: ["-100%", "100%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="h-full w-1/3 bg-cyan-500/50"
               />
            </div>
          </div>
        </div>

        {/* Scanning Lines */}
        <motion.div 
          animate={{ y: ["0%", "1000%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-white/10"
        />
      </div>
    </div>
  );
}
