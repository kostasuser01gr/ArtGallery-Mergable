"use client";

import { useEffect, useMemo, useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getRuntimeBanner, subscribeToPhotos } from "@/lib/db/client";
import type { Photo } from "@/lib/types";

type GalleryPageClientProps = {
  initialPhotos: Photo[];
};

export function GalleryPageClient({ initialPhotos }: GalleryPageClientProps) {
  const [livePhotoIds, setLivePhotoIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stop = subscribeToPhotos((event) => {
      setLivePhotoIds((prev) => {
        const next = new Set(prev);
        next.add(event.photoId);
        return next;
      });
    });

    return () => {
      stop();
    };
  }, []);

  const banner = useMemo(() => getRuntimeBanner(), []);

  return (
    <div className="space-y-6">
      {banner ? (
        <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {banner}
        </p>
      ) : null}
      <GalleryGrid photos={initialPhotos} livePhotoIds={livePhotoIds} />
    </div>
  );
}
