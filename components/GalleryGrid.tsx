"use client";

import { useMemo, useState } from "react";
import type { Photo } from "@/lib/types";
import { FiltersBar } from "@/components/FiltersBar";
import { PhotoCard } from "@/components/PhotoCard";

type GalleryGridProps = {
  photos: Photo[];
  livePhotoIds: Set<string>;
};

export function GalleryGrid({ photos, livePhotoIds }: GalleryGridProps) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => {
    return photos
      .filter((photo) => (tag === "all" ? true : photo.tags.includes(tag)))
      .filter((photo) => {
        if (!search) {
          return true;
        }
        const query = search.toLowerCase();
        return (
          photo.title.toLowerCase().includes(query) ||
          photo.description.toLowerCase().includes(query)
        );
      });
  }, [photos, search, tag]);

  const tags = useMemo(() => photos.flatMap((photo) => photo.tags), [photos]);

  return (
    <>
      <FiltersBar
        tags={tags}
        search={search}
        selectedTag={tag}
        onSearchChange={setSearch}
        onTagChange={setTag}
      />
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isLive={livePhotoIds.has(photo.id)}
          />
        ))}
      </div>
    </>
  );
}
