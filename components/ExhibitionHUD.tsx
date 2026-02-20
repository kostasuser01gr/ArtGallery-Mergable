"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ExhibitionHUD() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2500);
    const reveal = () => {
      setVisible(true);
      window.clearTimeout(timer);
      window.setTimeout(() => setVisible(false), 2500);
    };
    window.addEventListener("mousemove", reveal);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", reveal);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-200">
        Exhibition
      </div>
      <Link
        href="/gallery"
        className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs text-zinc-100"
      >
        Exit
      </Link>
    </div>
  );
}
