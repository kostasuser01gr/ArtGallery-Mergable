"use client";

import type { ConstructionStep } from "@/lib/types";

type TimelinePanelProps = {
  steps: ConstructionStep[];
  activeStepId: string;
  onSelect: (stepId: string) => void;
};

export function TimelinePanel({
  steps,
  activeStepId,
  onSelect,
}: TimelinePanelProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Construction Sequence</h2>
      </div>
      
      <div className="relative space-y-2">
        {/* Timeline connector line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-white/5" />
        
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isPast = steps.findIndex(s => s.id === activeStepId) > index;
          
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              className={`group relative flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500/10"
                  : "hover:bg-white/5"
              }`}
            >
              {/* Timeline Node */}
              <div className={`relative z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                isActive 
                  ? "border-cyan-400 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
                  : isPast
                    ? "border-cyan-400/50 bg-cyan-400/20"
                    : "border-white/20 bg-black"
              }`}>
                {isActive && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-40" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-400"
                  }`}>
                    Phase 0{index + 1}
                  </span>
                  <span className="text-[10px] text-zinc-600">•</span>
                  <span className="font-mono text-[10px] text-zinc-500">{step.timestamp}</span>
                </div>
                <p className={`mt-0.5 text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"
                }`}>
                  {step.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
