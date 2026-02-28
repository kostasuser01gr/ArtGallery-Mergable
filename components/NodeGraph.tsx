"use client";

import { motion } from "framer-motion";

type NodeGraphProps = {
  nodes: string[];
};

export function NodeGraph({ nodes }: NodeGraphProps) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="relative rounded-2xl border border-white/5 bg-black/40 p-4 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-3">
        {nodes.map((node, index) => (
          <motion.div 
            key={node} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="flex flex-col items-center pt-1">
              <div className="relative flex h-3 w-3 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/40" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              {index < nodes.length - 1 && (
                <div className="mt-1 h-6 w-px bg-gradient-to-b from-cyan-400/50 to-transparent" />
              )}
            </div>
            
            <div className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2 backdrop-blur-sm transition-colors hover:bg-cyan-500/10 hover:border-cyan-400/30">
              <span className="text-[10px] text-cyan-100">{node}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
