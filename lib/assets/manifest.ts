import manifestJson from "@/public/assets/manifest.json";
import { AssetsManifestSchema } from "@/lib/types";

export const manifest = AssetsManifestSchema.parse(manifestJson);

export function getSourceAssetPath(file: string): string {
  return file.startsWith("/") ? file : `/assets/${file}`;
}

export function getFinalCompositePath(): string {
  return getSourceAssetPath(manifest.finalComposite);
}
