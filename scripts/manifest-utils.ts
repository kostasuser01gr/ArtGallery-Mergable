import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type SourceLayer = {
  file: string;
  label: string;
  depth: number;
};

export type AssetsManifest = {
  finalComposite: string;
  sources: SourceLayer[];
  generatedAt: string;
};

const thisDir = path.dirname(fileURLToPath(import.meta.url));

export const projectRoot = path.resolve(thisDir, "..");
export const assetsDir = path.join(projectRoot, "public", "assets");
export const placeholdersDir = path.join(assetsDir, "placeholders");
export const manifestPath = path.join(assetsDir, "manifest.json");
export const photosDataPath = path.join(projectRoot, "data", "photos.json");
export const constructionDataPath = path.join(projectRoot, "data", "construction.json");

export const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function isImageFile(filePath: string) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

export function listImages(dir: string, recursive = false): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (recursive) {
        results.push(...listImages(fullPath, true));
      }
      continue;
    }

    if (isImageFile(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

export function toAssetRelative(filePath: string) {
  return path.relative(assetsDir, filePath).replaceAll(path.sep, "/");
}

function candidateScore(file: string, absolutePath: string) {
  const lower = file.toLowerCase();
  const stat = fs.statSync(absolutePath);
  const namedFinal = /final|composite|merged/.test(lower);

  return {
    namedFinal,
    size: stat.size,
  };
}

export function selectFinalComposite(files: string[]) {
  if (files.length === 0) {
    return null;
  }

  const sorted = [...files].sort((a, b) => {
    const scoreA = candidateScore(a, path.join(assetsDir, a));
    const scoreB = candidateScore(b, path.join(assetsDir, b));

    if (scoreA.namedFinal !== scoreB.namedFinal) {
      return scoreA.namedFinal ? -1 : 1;
    }

    return scoreB.size - scoreA.size;
  });

  return sorted[0] ?? null;
}

export function buildManifest(files: string[]): AssetsManifest {
  const finalComposite = selectFinalComposite(files) ?? files[0] ?? "placeholders/final-composite.png";

  const sourceCandidates = files.filter((file) => file !== finalComposite);
  const sources = (sourceCandidates.length > 0 ? sourceCandidates : files).map((file, index) => ({
    file,
    label: `Source ${index + 1}`,
    depth: Math.min(0.9, 0.15 + index * 0.07),
  }));

  return {
    finalComposite,
    sources,
    generatedAt: new Date().toISOString(),
  };
}

export function writeManifest(manifest: AssetsManifest) {
  ensureDir(assetsDir);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
}

export function writeSeedData(manifest: AssetsManifest) {
  const photos = manifest.sources.map((source, index) => ({
    id: `photo-${index + 1}`,
    title: `Imported Source ${index + 1}`,
    description: `Asset-driven source layer ${index + 1}`,
    tags: ["imported", "construction", "layer"],
    src: source.file.startsWith("/") ? source.file : `/assets/${source.file}`,
    finalComposite: manifest.finalComposite.startsWith("/")
      ? manifest.finalComposite
      : `/assets/${manifest.finalComposite}`,
    createdAt: new Date(Date.now() - index * 60_000).toISOString(),
    published: true,
    metadata: {
      camera: "Imported",
      lens: "Unknown",
      location: "Workspace",
    },
  }));

  const constructions = photos.map((photo, index) => ({
    photoId: photo.id,
    blueprint: [
      "Alignment pass",
      "Masking pass",
      "Color and bloom",
    ],
    steps: [
      {
        id: `${photo.id}-step-1`,
        label: "Load Source",
        timestamp: "00:00",
        promptText: "normalize source file",
        settingsJSON: {
          source: manifest.sources[index]?.file ?? manifest.sources[0]?.file,
        },
        preview: manifest.sources[index]?.file.startsWith("/")
          ? manifest.sources[index].file
          : `/assets/${manifest.sources[index]?.file ?? ""}`,
      },
      {
        id: `${photo.id}-step-2`,
        label: "Blend Layers",
        timestamp: "00:20",
        promptText: "apply radial reveal and parallax depth",
        settingsJSON: {
          depth: manifest.sources[index]?.depth ?? 0.2,
        },
        preview: manifest.sources[index]?.file.startsWith("/")
          ? manifest.sources[index].file
          : `/assets/${manifest.sources[index]?.file ?? ""}`,
      },
      {
        id: `${photo.id}-step-3`,
        label: "Finalize Composite",
        timestamp: "00:45",
        promptText: "merge into final composite output",
        settingsJSON: {
          finalComposite: manifest.finalComposite,
        },
        preview: manifest.finalComposite.startsWith("/")
          ? manifest.finalComposite
          : `/assets/${manifest.finalComposite}`,
      },
    ],
  }));

  fs.writeFileSync(photosDataPath, `${JSON.stringify(photos, null, 2)}\n`, "utf-8");
  fs.writeFileSync(constructionDataPath, `${JSON.stringify(constructions, null, 2)}\n`, "utf-8");
}
