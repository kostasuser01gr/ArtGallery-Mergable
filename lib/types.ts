import { z } from "zod";

export const SourceLayerSchema = z.object({
  file: z.string(),
  label: z.string(),
  depth: z.number().min(0).max(1),
});

export const AssetsManifestSchema = z.object({
  finalComposite: z.string(),
  sources: z.array(SourceLayerSchema).min(1),
  generatedAt: z.string(),
});

export const PhotoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  src: z.string(),
  finalComposite: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  createdAt: z.string(),
  published: z.boolean().default(true),
  metadata: z
    .object({
      camera: z.string().optional(),
      lens: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});

export const ConstructionStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  timestamp: z.string(),
  promptText: z.string(),
  settingsJSON: z.record(z.string(), z.unknown()),
  preview: z.string(),
});

export const ConstructionSchema = z.object({
  photoId: z.string(),
  blueprint: z.array(z.string()),
  steps: z.array(ConstructionStepSchema).min(1),
});

export const PhotoEventSchema = z.object({
  type: z.enum(["published", "updated"]),
  photoId: z.string(),
  createdAt: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export type SourceLayer = z.infer<typeof SourceLayerSchema>;
export type AssetsManifest = z.infer<typeof AssetsManifestSchema>;
export type Photo = z.infer<typeof PhotoSchema>;
export type ConstructionStep = z.infer<typeof ConstructionStepSchema>;
export type Construction = z.infer<typeof ConstructionSchema>;
export type PhotoEvent = z.infer<typeof PhotoEventSchema>;

export type PhotoFilters = {
  search?: string;
  tag?: string;
};
