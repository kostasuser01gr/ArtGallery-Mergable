"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type ParallaxStageProps = {
  offsetX: number;
  offsetY: number;
  reducedMotion: boolean;
  children: React.ReactNode;
};

export function ParallaxStage({
  offsetX,
  offsetY,
  reducedMotion,
  children,
}: ParallaxStageProps) {
  const animate = useMemo(
    () => (reducedMotion ? { x: 0, y: 0 } : { x: offsetX, y: offsetY }),
    [offsetX, offsetY, reducedMotion],
  );

  return (
    <motion.div
      animate={animate}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
