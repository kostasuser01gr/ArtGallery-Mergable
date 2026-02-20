import { ExhibitionHUD } from "@/components/ExhibitionHUD";
import { ScenePlayer } from "@/components/ScenePlayer";
import { featureFlags } from "@/lib/env";

export default function ExhibitionPage() {
  if (!featureFlags.exhibition) {
    return (
      <section className="rounded-xl border border-white/10 bg-black/30 p-5 text-zinc-300">
        Exhibition mode is disabled via feature flag.
      </section>
    );
  }

  return (
    <section className="fixed inset-0 bg-black p-4">
      <ExhibitionHUD />
      <div className="mx-auto mt-14 max-w-6xl">
        <ScenePlayer autoplay loop />
      </div>
    </section>
  );
}
