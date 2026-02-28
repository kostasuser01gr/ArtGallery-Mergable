import Link from "next/link";
import { ScenePlayer } from "@/components/ScenePlayer";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col justify-center">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      <section className="relative z-10 space-y-16 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5">
                <div className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">Cinematic Build Sequence v4.2</span>
              </div>
              
              <h1 className="font-display text-6xl leading-[1.1] text-white sm:text-7xl xl:text-8xl">
                Raw captures <br />
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">resolve</span> into art.
              </h1>
              
              <p className="max-w-xl text-lg leading-relaxed text-zinc-400/90">
                Experience a premium cinematic journey where raw construction data meets high-end visualization. 
                Follow each processing step through a real-time responsive engine.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/gallery"
                className="group relative flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95"
              >
                Launch Experience
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/exhibition"
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
              >
                Cinema Mode
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="font-mono text-2xl text-white">4K</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Native Render</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-mono text-2xl text-white">60fps</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Fluid Motion</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-mono text-2xl text-white">Real-time</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Engine Sync</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
               <ScenePlayer autoplay loop compact />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
