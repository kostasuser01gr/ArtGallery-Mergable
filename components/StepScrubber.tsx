"use client";

import type { ConstructionStep } from "@/lib/types";

type StepScrubberProps = {
  steps: ConstructionStep[];
  activeStepId: string;
  onSelect: (stepId: string) => void;
};

export function StepScrubber({ steps, activeStepId, onSelect }: StepScrubberProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
      <div className="relative flex items-center justify-between gap-2">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/15" aria-hidden />
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(step.id)}
            className="relative z-10 flex flex-col items-center"
            aria-label={`Go to ${step.label}`}
          >
            <span
              className={`h-4 w-4 rounded-full border ${
                step.id === activeStepId
                  ? "border-emerald-300 bg-emerald-300"
                  : "border-white/30 bg-black"
              }`}
            />
            <span className="mt-2 text-[10px] text-zinc-400">{step.timestamp}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
