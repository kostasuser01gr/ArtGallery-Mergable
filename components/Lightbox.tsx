"use client";

import Image from "next/image";
import { useEffect } from "react";

type LightboxProps = {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
};

export function Lightbox({ open, src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
        <Image src={src} alt={alt} width={1800} height={1300} className="h-auto max-h-[92vh] w-auto rounded-xl" />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-sm text-white"
      >
        Close
      </button>
    </div>
  );
}
