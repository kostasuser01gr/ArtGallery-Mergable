"use client";

import { useMemo, useState } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { NodeGraph } from "@/components/NodeGraph";
import { ScenePlayer } from "@/components/ScenePlayer";
import { StepScrubber } from "@/components/StepScrubber";
import { TimelinePanel } from "@/components/TimelinePanel";
import type { Construction, Photo } from "@/lib/types";

type ConstructionClientProps = {
  photo: Photo;
  construction: Construction;
};

export function ConstructionClient({ photo, construction }: ConstructionClientProps) {
  const [activeId, setActiveId] = useState(construction.steps[0]?.id ?? "");

  const activeStep = useMemo(
    () => construction.steps.find((step) => step.id === activeId) ?? construction.steps[0],
    [activeId, construction.steps],
  );

  const previousStep = useMemo(() => {
    const index = construction.steps.findIndex((step) => step.id === activeStep?.id);
    return construction.steps[Math.max(0, index - 1)] ?? activeStep;
  }, [activeStep, construction.steps]);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr_320px]">
      <TimelinePanel
        steps={construction.steps}
        activeStepId={activeStep?.id ?? ""}
        onSelect={setActiveId}
      />

      <div className="space-y-4">
        <ScenePlayer blueprint={construction.blueprint} compact loop={false} autoplay={false} />
        <StepScrubber
          steps={construction.steps}
          activeStepId={activeStep?.id ?? ""}
          onSelect={setActiveId}
        />
        <BeforeAfterSlider
          before={previousStep?.preview ?? photo.src}
          after={activeStep?.preview ?? photo.finalComposite ?? photo.src}
        />
      </div>

      <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-400">Step Detail</h2>
        <p className="text-sm font-medium text-white">{activeStep?.label}</p>
        <p className="text-xs text-zinc-300">{activeStep?.promptText}</p>
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-zinc-300">
{JSON.stringify(activeStep?.settingsJSON ?? {}, null, 2)}
        </pre>
        <NodeGraph nodes={construction.blueprint} />
      </aside>
    </div>
  );
}
