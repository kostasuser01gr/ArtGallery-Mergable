"use client";

import { useMemo } from "react";

type FiltersBarProps = {
  tags: string[];
  search: string;
  selectedTag: string;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export function FiltersBar({
  tags,
  search,
  selectedTag,
  onSearchChange,
  onTagChange,
}: FiltersBarProps) {
  const uniqueTags = useMemo(() => Array.from(new Set(tags)).sort(), [tags]);

  return (
    <div className="sticky top-0 z-20 mb-6 grid gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur sm:grid-cols-[1fr_220px]">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none ring-emerald-300 transition focus:ring-2"
        placeholder="Search title or description"
      />
      <select
        value={selectedTag}
        onChange={(event) => onTagChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none ring-emerald-300 transition focus:ring-2"
      >
        <option value="all">All tags</option>
        {uniqueTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
