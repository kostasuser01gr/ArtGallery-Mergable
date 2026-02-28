"use client";

import { useMemo, useState, useEffect } from "react";
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

type RenderStatus = "idle" | "queueing" | "rendering" | "mastering" | "complete";

export function ConstructionClient({ photo, construction }: ConstructionClientProps) {
  const [activeId, setActiveId] = useState(construction.steps[0]?.id ?? "");
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [renderProgress, setRenderProgress] = useState(0);

  const activeStep = useMemo(
    () => construction.steps.find((step) => step.id === activeId) ?? construction.steps[0],
    [activeId, construction.steps],
  );

  const previousStep = useMemo(() => {
    const index = construction.steps.findIndex((step) => step.id === activeStep?.id);
    return construction.steps[Math.max(0, index - 1)] ?? activeStep;
  }, [activeStep, construction.steps]);

  // Simulated Render Pipeline
  const startRender = () => {
    setRenderStatus("queueing");
    setRenderProgress(0);
  };

  useEffect(() => {
    if (renderStatus === "idle" || renderStatus === "complete") return;

    let timer: NodeJS.Timeout;
    if (renderStatus === "queueing") {
      timer = setTimeout(() => setRenderStatus("rendering"), 1500);
    } else if (renderStatus === "rendering") {
      if (renderProgress < 100) {
        timer = setTimeout(() => setRenderProgress(p => Math.min(100, p + Math.random() * 8)), 200);
      } else {
        // Use a small delay to avoid synchronous state update in effect
        timer = setTimeout(() => setRenderStatus("mastering"), 10);
      }
    } else if (renderStatus === "mastering") {
      timer = setTimeout(() => setRenderStatus("complete"), 2000);
    }

    return () => clearTimeout(timer);
  }, [renderStatus, renderProgress]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_340px] xl:gap-8">
      {/* Left Panel: Timeline */}
      <div className="relative">
        <div className="sticky top-24">
          <TimelinePanel
            steps={construction.steps}
            activeStepId={activeStep?.id ?? ""}
            onSelect={setActiveId}
          />
        </div>
      </div>

      {/* Center Panel: Main Viewers */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Live Render Engine</h3>
          </div>
          <ScenePlayer blueprint={construction.blueprint} compact loop={false} autoplay={false} />
        </div>

        <StepScrubber
          steps={construction.steps}
          activeStepId={activeStep?.id ?? ""}
          onSelect={setActiveId}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Structural Analysis</h3>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-zinc-500">Dual Mode Engine</span>
          </div>
          <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-2 shadow-2xl">
            <BeforeAfterSlider
              before={previousStep?.preview ?? photo.src}
              after={activeStep?.preview ?? photo.finalComposite ?? photo.src}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Metadata & Orchestrator */}
      <aside className="space-y-6">
        {/* Render Orchestrator */}
        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Render Orchestrator</h2>
          
          {renderStatus === "idle" ? (
            <button 
              onClick={startRender}
              className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 text-cyan-400 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-white">Export 4K Master</p>
                <p className="mt-1 text-[9px] text-zinc-500 uppercase">H.264 / 60 FPS / High Profile</p>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-cyan-400 animate-pulse">{renderStatus}...</span>
                <span className="text-white">{Math.round(renderProgress)}%</span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Worker Node</span>
                  <span className="text-zinc-300">AWS-EU-CENTRAL-1</span>
                </div>
                <div className="mt-2 flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Frame Range</span>
                  <span className="text-zinc-300">0001 - 0360</span>
                </div>
              </div>

              {renderStatus === "complete" && (
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-emerald-400 active:scale-95">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Master
                </button>
              )}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Step Telemetry</h2>
            <span className="font-mono text-[10px] text-zinc-500">ID: {activeStep?.id.slice(0, 8)}</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="font-display text-2xl text-white">{activeStep?.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{activeStep?.promptText}</p>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Execution Parameters</span>
              <pre className="overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[10px] leading-relaxed text-cyan-200/80 shadow-inner">
{JSON.stringify(activeStep?.settingsJSON ?? {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Node Topology</h2>
          <NodeGraph nodes={construction.blueprint} />
        </div>
      </aside>
    </div>
  );
}
