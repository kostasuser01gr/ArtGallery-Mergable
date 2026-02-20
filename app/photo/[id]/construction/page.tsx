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
    <section className="space-y-6">
      <h1 className="font-display text-3xl text-white">{photo.title} Construction Timeline</h1>
      <ConstructionClient photo={photo} construction={construction} />
    </section>
  );
}
