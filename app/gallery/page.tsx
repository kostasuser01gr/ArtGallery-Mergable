import { GalleryPageClient } from "@/components/GalleryPageClient";
import { getPhotos } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">Gallery</h1>
        <p className="mt-1 text-zinc-400">Filter, search, and watch mock realtime updates.</p>
      </div>
      <GalleryPageClient initialPhotos={photos} />
    </section>
  );
}
