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
    <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
      <h2 className="text-xs uppercase tracking-[0.24em] text-zinc-400">Construction</h2>
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          onClick={() => onSelect(step.id)}
          className={`w-full rounded-xl border p-3 text-left transition ${
            step.id === activeStepId
              ? "border-emerald-300 bg-emerald-300/10"
              : "border-white/10 bg-black/40 hover:border-white/30"
          }`}
        >
          <p className="text-xs text-zinc-500">Step {index + 1} • {step.timestamp}</p>
          <p className="mt-1 text-sm font-medium text-white">{step.label}</p>
        </button>
      ))}
    </div>
  );
}
