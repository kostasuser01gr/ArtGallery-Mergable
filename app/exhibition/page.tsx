"use client";

import { useState } from "react";
import { ExhibitionHUD } from "@/components/ExhibitionHUD";
import { ScenePlayer } from "@/components/ScenePlayer";
import { LiveMonitor } from "@/components/LiveMonitor";
import { featureFlags } from "@/lib/env";

export default function ExhibitionPage() {
  const [view, setView] = useState<"cinema" | "monitor">("cinema");

  if (!featureFlags.exhibition) {
    return (
      <section className="rounded-xl border border-white/10 bg-black/30 p-5 text-zinc-300">
        Exhibition mode is disabled via feature flag.
      </section>
    );
  }

  return (
    <section className="fixed inset-0 bg-black p-4 lg:p-8 flex flex-col">
      <ExhibitionHUD />
      
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex gap-2 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-xl">
        <button
          onClick={() => setView("cinema")}
          className={`rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
            view === "cinema" ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Cinematic
        </button>
        <button
          onClick={() => setView("monitor")}
          className={`rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
            view === "monitor" ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Live Site
        </button>
      </div>

      <div className="mx-auto mt-24 w-full max-w-7xl flex-1 flex items-center justify-center">
        {view === "cinema" ? (
          <div className="w-full">
            <ScenePlayer autoplay loop />
          </div>
        ) : (
          <div className="w-full">
            <LiveMonitor />
          </div>
        )}
      </div>
    </section>
  );
}
