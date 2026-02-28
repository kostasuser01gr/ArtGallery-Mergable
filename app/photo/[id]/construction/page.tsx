import { notFound } from "next/navigation";
import { ConstructionClient } from "@/components/ConstructionClient";
import { getConstruction, getPhotoById } from "@/lib/db/client";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ConstructionPage({ params }: Params) {
  const { id } = await params;
  const photo = await getPhotoById(id);
  const construction = await getConstruction(id);

  if (!photo || !construction) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
          Sequence Data
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/50 to-transparent" />
      </div>
      
      <div className="text-center">
        <h1 className="font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
          {photo.title}
        </h1>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          Construction Timeline
        </p>
      </div>
      
      <ConstructionClient photo={photo} construction={construction} />
    </section>
  );
}
