"use client";

import { motion } from "framer-motion";
import type { ConstructionStep } from "@/lib/types";

type StepScrubberProps = {
  steps: ConstructionStep[];
  activeStepId: string;
  onSelect: (stepId: string) => void;
};

export function StepScrubber({ steps, activeStepId, onSelect }: StepScrubberProps) {
  const activeIndex = steps.findIndex(s => s.id === activeStepId);

  return (
    <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl">
      <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Timeline Scrubber</h3>
      <div className="relative flex items-center justify-between gap-2 px-2">
        {/* Background track */}
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-white/10" aria-hidden />
        
        {/* Active track fill */}
        <div 
          className="absolute left-2 top-1/2 h-px -translate-y-1/2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-500" 
          style={{ width: `calc(${activeIndex / (Math.max(1, steps.length - 1)) * 100}% - 16px)` }}
          aria-hidden 
        />

        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isPast = index <= activeIndex;
          
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              className="group relative z-10 flex flex-col items-center outline-none"
              aria-label={`Go to ${step.label}`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-125 ${
                  isActive
                    ? "border-emerald-400 bg-black shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                    : isPast
                      ? "border-emerald-400/50 bg-emerald-900/30"
                      : "border-white/20 bg-black group-hover:border-white/50"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeScrubberIndicator"
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </div>
              <span className={`absolute top-6 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                isActive ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"
              }`}>
                {step.timestamp}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between px-2 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">
        <span>Start</span>
        <span>End</span>
      </div>
    </div>
  );
}
