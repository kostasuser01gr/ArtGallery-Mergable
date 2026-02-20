"use client";

import { useEffect, useMemo, useState } from "react";
import { LayerStackCanvas } from "@/components/LayerStackCanvas";
import { useReducedMotionPreference } from "@/components/ReducedMotionProvider";
import { manifest } from "@/lib/assets/manifest";

type ScenePlayerProps = {
  blueprint?: string[];
  autoplay?: boolean;
  loop?: boolean;
  compact?: boolean;
};

export function ScenePlayer({
  blueprint,
  autoplay = true,
  loop = true,
  compact = false,
}: ScenePlayerProps) {
  const reducedMotion = useReducedMotionPreference();
  const [playing, setPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) {
      return;
    }

    let raf = 0;
    let start = performance.now();
    const duration = reducedMotion ? 4000 : 9000;

    const tick = (timestamp: number) => {
      const elapsed = timestamp - start;
      const ratio = elapsed / duration;
      const next = loop ? ratio % 1 : Math.min(1, ratio);
      setProgress(next);

      if (!loop && ratio >= 1) {
        setPlaying(false);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      start = 0;
    };
  }, [loop, playing, reducedMotion]);

  const sources = useMemo(
    () => manifest.sources.map((entry) => ({ ...entry })),
    [],
  );

  return (
    <div className="space-y-3">
      <LayerStackCanvas
        width={compact ? 960 : 1280}
        height={compact ? 540 : 720}
        sources={sources}
        finalComposite={manifest.finalComposite}
        progress={progress}
        reducedMotion={reducedMotion}
        blueprint={blueprint}
      />
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-zinc-200">
        <button
          type="button"
          onClick={() => setPlaying((current) => !current)}
          className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(event) => {
            const value = Number(event.target.value) / 1000;
            setProgress(value);
            setPlaying(false);
          }}
          className="w-full"
          aria-label="Timeline progress"
        />
        <span className="w-14 text-right tabular-nums">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
