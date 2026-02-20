import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/types";

export function PhotoCard({ photo, isLive }: { photo: Photo; isLive?: boolean }) {
  return (
    <Link
      href={`/photo/${photo.id}`}
      className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-black/20"
    >
      <Image
        src={photo.src}
        alt={photo.title}
        width={1200}
        height={900}
        className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-sm text-zinc-200">
          <span className="font-semibold text-white">{photo.title}</span>
          {isLive ? (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-xs font-medium text-black">
              Live
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-zinc-300">{photo.tags.join(" • ")}</p>
      </div>
    </Link>
  );
}
