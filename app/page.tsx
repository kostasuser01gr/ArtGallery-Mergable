import Link from "next/link";
import { ScenePlayer } from "@/components/ScenePlayer";
import { featureFlags } from "@/lib/env";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">Cinematic Build Sequence</p>
          <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl">
            Watch raw construction captures resolve into a finished composite.
          </h1>
          <p className="max-w-xl text-base text-zinc-300">
            Browse source photos, follow each processing step, and run the same timeline in real-time preview or exported video.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="rounded-full border border-emerald-300/60 bg-emerald-300/10 px-5 py-2.5 text-sm font-medium text-emerald-200"
            >
              Play Construction Animation
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-200"
            >
              Open Gallery
            </Link>
            {featureFlags.exhibition ? (
              <Link
                href="/exhibition"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-200"
              >
                Exhibition Mode
              </Link>
            ) : null}
          </div>
          <p className="text-xs text-zinc-500">
            Video export enabled: {featureFlags.videoExport ? "yes" : "no"}. See README for `npm run video:render`.
          </p>
        </div>
        <ScenePlayer autoplay loop compact />
      </div>
    </section>
  );
}
