"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ExhibitionHUD() {
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timer: number;
    const reveal = () => {
      setVisible(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener("mousemove", reveal);
    reveal();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", reveal);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top Bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">System Status</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-medium text-white">Live Exhibition Engine v4.2</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Local Time</span>
            <span className="font-mono text-xs text-zinc-300">{time}</span>
          </div>
        </div>

        <Link
          href="/gallery"
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-6 py-2 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/5 active:scale-95"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white">Exit Cinema</span>
          <div className="h-1 w-1 rounded-full bg-white/40 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </Link>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute inset-y-0 left-0 w-24 flex flex-col justify-center items-center gap-12 pointer-events-none opacity-40">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        <span className="rotate-90 text-[8px] uppercase tracking-[1em] text-zinc-500 whitespace-nowrap">Cinematic Stream</span>
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
      </div>

      <div className="absolute inset-y-0 right-0 w-24 flex flex-col justify-center items-center gap-12 pointer-events-none opacity-40">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
        <span className="-rotate-90 text-[8px] uppercase tracking-[1em] text-zinc-500 whitespace-nowrap">Resolution 4K Ready</span>
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
      </div>

      {/* Bottom Status */}
      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
        <div className="flex items-center gap-8 rounded-2xl border border-white/5 bg-black/40 px-8 py-3 backdrop-blur-xl">
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Bitrate</span>
              <span className="font-mono text-[10px] text-emerald-400">84.2 Mbps</span>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Latent Buffer</span>
              <span className="font-mono text-[10px] text-cyan-400">0.02ms</span>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Encoding</span>
              <span className="font-mono text-[10px] text-zinc-300">AV1 / High</span>
           </div>
        </div>
      </div>
    </div>
  );
}
