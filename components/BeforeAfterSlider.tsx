"use client";

import Image from "next/image";
import { useState } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
};

export function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <Image src={before} alt="Before" width={1280} height={720} className="h-auto w-full object-cover" />
        <div
          className="absolute inset-y-0 right-0 overflow-hidden"
          style={{ width: `${100 - position}%` }}
        >
          <Image src={after} alt="After" width={1280} height={720} className="h-full w-full object-cover" />
        </div>
        <div
          className="absolute inset-y-0 w-0.5 bg-emerald-300"
          style={{ left: `${position}%` }}
          aria-hidden
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="w-full"
        aria-label="Before and after slider"
      />
    </div>
  );
}
