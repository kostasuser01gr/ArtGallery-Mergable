"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/types";

export function PhotoCard({ photo, isLive }: { photo: Photo; isLive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href={`/photo/${photo.id}`}
        className="group relative mb-6 block break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-xl transition-all hover:border-white/20 hover:shadow-cyan-900/10"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.title}
            width={1200}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 ease-[0.23,1,0.32,1] group-hover:scale-110 group-hover:blur-[1px]"
          />
          
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
          
          {/* Status Badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
            {isLive ? (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Processing</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Captured</span>
            )}
          </div>

          {/* Metadata Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/80">
                {photo.tags[0] || "Architecture"}
              </span>
              <h3 className="font-display text-2xl leading-tight text-white group-hover:text-cyan-50">
                {photo.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-[10px] font-medium text-zinc-400">
                  {photo.tags.slice(1).join(" • ") || "Studio Capture"}
                </span>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Sequence</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
