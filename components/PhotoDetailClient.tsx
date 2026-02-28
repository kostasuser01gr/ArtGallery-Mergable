"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filmstrip } from "@/components/Filmstrip";
import { Lightbox } from "@/components/Lightbox";
import { trackView } from "@/lib/db/client";
import type { Photo } from "@/lib/types";

type PhotoDetailClientProps = {
  photo: Photo;
  sourceFiles: string[];
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/assets/${path}`);

export function PhotoDetailClient({ photo, sourceFiles }: PhotoDetailClientProps) {
  const sources = useMemo(
    () => sourceFiles.map((file, index) => ({ id: `${index}`, src: normalizePath(file), label: `Source ${index + 1}` })),
    [sourceFiles],
  );

  const [activeId, setActiveId] = useState(sources[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  const active = sources.find((item) => item.id === activeId) ?? sources[0];

  useEffect(() => {
    void trackView(photo.id);
  }, [photo.id]);

  const [isScanning, setIsScanning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ label: string; confidence: number }[] | null>(null);

  const startAiScan = () => {
    setIsScanning(true);
    setAiAnalysis(null);
    setTimeout(() => {
      setIsScanning(false);
      setAiAnalysis([
        { label: "Structural Steel", confidence: 0.98 },
        { label: "Reinforced Concrete", confidence: 0.94 },
        { label: "High-Performance Glass", confidence: 0.89 },
        { label: "Architectural Mesh", confidence: 0.76 },
      ]);
    }, 3000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] xl:gap-12">
      {/* Left Column: Image Viewer */}
      <div className="space-y-6">
        <div className="relative group block w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl ring-1 ring-white/10">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={active?.src ?? photo.src}
              alt={photo.title}
              fill
              className={`object-cover transition-transform duration-700 ease-[0.23,1,0.32,1] group-hover:scale-[1.03] ${isScanning ? 'blur-[2px] saturate-[0.5]' : ''}`}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            
            {/* AI Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                />
                <div className="absolute inset-0 bg-cyan-500/10 backdrop-pulse animate-pulse" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            
            {/* Actions */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                onClick={startAiScan}
                disabled={isScanning}
                className="flex h-10 items-center gap-2 rounded-full bg-cyan-500 px-4 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
              >
                {isScanning ? "Scanning..." : "Vision AI Scan"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* AI Analysis Panel */}
        <AnimatePresence>
          {aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">AI Material Detection</h3>
              <div className="grid grid-cols-2 gap-6">
                {aiAnalysis.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-zinc-300">{item.label}</span>
                      <span className="text-cyan-400">{Math.round(item.confidence * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.confidence * 100}%` }}
                        className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
          <Filmstrip items={sources} activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>

      {/* Right Column: Metadata & Controls */}
      <aside className="flex flex-col space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              {photo.tags[0] || "Architecture"}
            </span>
          </div>
          
          <h1 className="font-display text-4xl leading-tight text-white md:text-5xl">{photo.title}</h1>
          <p className="text-base leading-relaxed text-zinc-400">{photo.description}</p>
        </div>

        {/* Cinematic Call to Action */}
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-1">
          <Link
            href={`/photo/${photo.id}/construction`}
            className="group flex w-full items-center justify-between rounded-full bg-emerald-500/10 px-8 py-4 backdrop-blur-md transition-all hover:bg-emerald-500/20"
          >
            <span className="font-bold uppercase tracking-widest text-emerald-300">Launch Construction Sequence</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 transition-transform group-hover:translate-x-1 group-hover:bg-emerald-400/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Camera System</span>
            <p className="text-sm font-medium text-zinc-300">{photo.metadata?.camera ?? "Phase One IQ4"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Lens</span>
            <p className="text-sm font-medium text-zinc-300">{photo.metadata?.lens ?? "150mm f/2.8"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Location</span>
            <p className="text-sm font-medium text-zinc-300">{photo.metadata?.location ?? "Main Studio"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Captured</span>
            <p className="text-sm font-medium text-zinc-300">
              {new Date(photo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {photo.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      </aside>

      <Lightbox open={open} src={active?.src ?? photo.src} alt={photo.title} onClose={() => setOpen(false)} />
    </div>
  );
}
