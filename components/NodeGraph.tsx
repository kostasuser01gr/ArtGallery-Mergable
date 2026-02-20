"use client";

type NodeGraphProps = {
  nodes: string[];
};

export function NodeGraph({ nodes }: NodeGraphProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500">Blueprint Nodes</h3>
      <div className="mt-3 space-y-2">
        {nodes.map((node, index) => (
          <div key={node} className="flex items-center gap-2 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            <span>{node}</span>
            {index < nodes.length - 1 ? <span className="text-zinc-600">→</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
