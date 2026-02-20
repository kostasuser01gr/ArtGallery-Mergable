"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Command = {
  href: string;
  label: string;
};

const commands: Command[] = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/exhibition", label: "Exhibition" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur" onClick={() => setOpen(false)}>
      <div
        className="mx-auto mt-24 max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Jump To</p>
        <div className="space-y-1">
          {commands.map((command) => (
            <Link
              key={command.href}
              href={command.href}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {command.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
