"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block overflow-hidden rounded-2xl border border-white/10"
        >
          <Image
            src={active?.src ?? photo.src}
            alt={photo.title}
            width={1500}
            height={1000}
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </button>
        <Filmstrip items={sources} activeId={activeId} onSelect={setActiveId} />
      </div>
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <h1 className="text-2xl font-semibold text-white">{photo.title}</h1>
        <p className="text-sm text-zinc-300">{photo.description}</p>
        <div className="text-xs text-zinc-400">
          <p>Tags: {photo.tags.join(", ")}</p>
          <p>Captured: {new Date(photo.createdAt).toLocaleString()}</p>
          <p>Camera: {photo.metadata?.camera ?? "Unknown"}</p>
          <p>Lens: {photo.metadata?.lens ?? "Unknown"}</p>
          <p>Location: {photo.metadata?.location ?? "Unknown"}</p>
        </div>
        <Link
          href={`/photo/${photo.id}/construction`}
          className="inline-flex rounded-full border border-emerald-300/60 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200"
        >
          View Construction
        </Link>
      </aside>
      <Lightbox open={open} src={active?.src ?? photo.src} alt={photo.title} onClose={() => setOpen(false)} />
    </div>
  );
}
