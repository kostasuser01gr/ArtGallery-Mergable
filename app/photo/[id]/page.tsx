import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoDetailClient } from "@/components/PhotoDetailClient";
import { manifest } from "@/lib/assets/manifest";
import { getPhotoById } from "@/lib/db/client";

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    return {
      title: "Photo Not Found",
    };
  }

  return {
    title: `${photo.title} | Construction Photo`,
    description: photo.description,
    openGraph: {
      title: photo.title,
      description: photo.description,
      images: [photo.src],
    },
  };
}

export default async function PhotoPage({ params }: Params) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <PhotoDetailClient photo={photo} sourceFiles={manifest.sources.map((entry) => entry.file)} />
    </section>
  );
}
