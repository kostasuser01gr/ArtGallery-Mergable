"use client";

import Image from "next/image";

type FilmstripItem = {
  id: string;
  src: string;
  label: string;
};

type FilmstripProps = {
  items: FilmstripItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function Filmstrip({ items, activeId, onSelect }: FilmstripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`shrink-0 overflow-hidden rounded-lg border ${
            item.id === activeId ? "border-emerald-300" : "border-white/10"
          }`}
          aria-label={`Select ${item.label}`}
        >
          <Image src={item.src} alt={item.label} width={140} height={100} className="h-16 w-24 object-cover" />
        </button>
      ))}
    </div>
  );
}
