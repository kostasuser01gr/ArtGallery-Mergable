import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  assetsDir,
  ensureDir,
  isImageFile,
  listImages,
  toAssetRelative,
  writeSeedData,
} from "./manifest-utils";
import { generateManifest } from "./generate-manifest";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function copyImagesFromFolder(inputFolder: string) {
  ensureDir(assetsDir);
  const absoluteInput = path.resolve(process.cwd(), inputFolder);

  if (!fs.existsSync(absoluteInput) || !fs.statSync(absoluteInput).isDirectory()) {
    throw new Error(`Input folder not found: ${absoluteInput}`);
  }

  const sourceFiles = listImages(absoluteInput, true);
  if (sourceFiles.length === 0) {
    throw new Error("No images found to import (jpg/jpeg/png/webp)");
  }

  const copied: string[] = [];

  sourceFiles.forEach((source, index) => {
    if (!isImageFile(source)) {
      return;
    }

    const ext = path.extname(source).toLowerCase();
    const base = slugify(path.basename(source, ext)) || `image-${index + 1}`;
    let targetFile = `import-${base}${ext}`;
    let targetPath = path.join(assetsDir, targetFile);
    let serial = 1;

    while (fs.existsSync(targetPath)) {
      targetFile = `import-${base}-${serial}${ext}`;
      targetPath = path.join(assetsDir, targetFile);
      serial += 1;
    }

    fs.copyFileSync(source, targetPath);
    copied.push(toAssetRelative(targetPath));
  });

  return copied;
}

async function main() {
  const inputFolder = process.argv[2];
  if (!inputFolder) {
    throw new Error("Usage: npm run assets:import -- <folder>");
  }

  const copied = copyImagesFromFolder(inputFolder);
  const manifest = await generateManifest();
  writeSeedData(manifest);

  console.log(`Imported ${copied.length} assets`);
  console.log(`Manifest written with ${manifest.sources.length} sources`);
  console.log("Seed data updated: data/photos.json and data/construction.json");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
