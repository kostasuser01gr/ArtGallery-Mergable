"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="group relative flex-shrink-0"
            aria-label={`Select ${item.label}`}
          >
            <div
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isActive 
                  ? "border-cyan-400 ring-1 ring-cyan-400/50 scale-105" 
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <Image 
                src={item.src} 
                alt={item.label} 
                width={140} 
                height={100} 
                className="h-16 w-24 object-cover sm:h-20 sm:w-28" 
              />
              
              {isActive && (
                <motion.div
                  layoutId="active-filmstrip-item"
                  className="absolute inset-0 bg-cyan-400/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
