import { pathToFileURL } from "node:url";
import {
  assetsDir,
  buildManifest,
  listImages,
  toAssetRelative,
  writeManifest,
} from "./manifest-utils";
import { generatePlaceholders } from "./generate-placeholders";

export async function generateManifest() {
  const allImages = listImages(assetsDir, true).map(toAssetRelative);
  const realImages = allImages.filter((file) => !file.startsWith("placeholders/"));

  if (realImages.length < 2) {
    const placeholder = await generatePlaceholders();
    const manifest = buildManifest([
      ...placeholder.sourceFiles,
      placeholder.finalComposite,
    ]);
    writeManifest(manifest);
    console.log("Manifest generated from placeholders");
    return manifest;
  }

  const manifest = buildManifest(realImages);
  writeManifest(manifest);
  console.log("Manifest generated from real assets");
  return manifest;
}

async function main() {
  const manifest = await generateManifest();
  console.log(
    `finalComposite=${manifest.finalComposite} sources=${manifest.sources.length}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  void main();
}
