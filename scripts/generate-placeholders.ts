import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PNG } from "pngjs";
import {
  assetsDir,
  ensureDir,
  placeholdersDir,
  toAssetRelative,
} from "./manifest-utils";

type PlaceholderResult = {
  sourceFiles: string[];
  finalComposite: string;
};

function palette(index: number) {
  const palettes = [
    [16, 30, 44],
    [33, 58, 70],
    [75, 44, 38],
    [48, 62, 28],
    [22, 36, 68],
  ];
  return palettes[index % palettes.length];
}

async function trySharp(
  outputPath: string,
  width: number,
  height: number,
  index: number,
) {
  try {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    const mod = req("sharp") as {
      default: (
        input: Buffer,
        options: { raw: { width: number; height: number; channels: number } },
      ) => {
        png: () => { toFile: (file: string) => Promise<void> };
      };
    };
    const sharp = mod.default;
    const [r, g, b] = palette(index);
    const data = Buffer.alloc(width * height * 3);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 3;
        const tone = Math.floor((x / width) * 50 + (y / height) * 40);
        data[i] = Math.min(255, r + tone);
        data[i + 1] = Math.min(255, g + tone);
        data[i + 2] = Math.min(255, b + tone);
      }
    }

    await sharp(data, { raw: { width, height, channels: 3 } })
      .png()
      .toFile(outputPath);
    return true;
  } catch {
    return false;
  }
}

function writePng(
  outputPath: string,
  width: number,
  height: number,
  index: number,
  withRing = false,
) {
  const image = new PNG({ width, height });
  const [r, g, b] = palette(index);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (width * y + x) << 2;
      const tone = Math.floor((x / width) * 60 + (y / height) * 45);
      const line = ((x + y + index * 19) % 67) < 3 ? 26 : 0;
      image.data[idx] = Math.min(255, r + tone + line);
      image.data[idx + 1] = Math.min(255, g + tone + line);
      image.data[idx + 2] = Math.min(255, b + tone + line);
      image.data[idx + 3] = 255;

      if (withRing) {
        const cx = width / 2;
        const cy = height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ring = Math.abs(dist - Math.min(width, height) * 0.28) < 2;
        if (ring) {
          image.data[idx] = 210;
          image.data[idx + 1] = 240;
          image.data[idx + 2] = 255;
        }
      }
    }
  }

  fs.writeFileSync(outputPath, PNG.sync.write(image));
}

export async function generatePlaceholders(): Promise<PlaceholderResult> {
  ensureDir(placeholdersDir);

  const sourceFiles: string[] = [];

  for (let i = 0; i < 10; i += 1) {
    const fileName = `source-${i + 1}.png`;
    const outputPath = path.join(placeholdersDir, fileName);

    const usedSharp = await trySharp(outputPath, 1280, 720, i);
    if (!usedSharp) {
      writePng(outputPath, 1280, 720, i);
    }

    sourceFiles.push(toAssetRelative(outputPath));
  }

  const finalCompositePath = path.join(placeholdersDir, "final-composite.png");
  const finalSharp = await trySharp(finalCompositePath, 1920, 1080, 999);
  if (!finalSharp) {
    writePng(finalCompositePath, 1920, 1080, 999, true);
  }

  ensureDir(assetsDir);

  return {
    sourceFiles,
    finalComposite: toAssetRelative(finalCompositePath),
  };
}

async function main() {
  const result = await generatePlaceholders();
  console.log(
    `Generated ${result.sourceFiles.length} placeholders and ${result.finalComposite}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  void main();
}
