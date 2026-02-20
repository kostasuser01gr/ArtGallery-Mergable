import { z } from "zod";

const BooleanFlagSchema = z
  .union([z.string(), z.boolean(), z.undefined()])
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "undefined") {
      return true;
    }
    return value.toLowerCase() === "true";
  });

const EnvSchema = z.object({
  NEXT_PUBLIC_MODE: z.enum(["mock", "supabase"]).default("mock"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  ENABLE_EXHIBITION: BooleanFlagSchema.default(true),
  ENABLE_VIDEO_EXPORT: BooleanFlagSchema.default(true),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function readEnv(input: NodeJS.ProcessEnv = process.env): AppEnv {
  return EnvSchema.parse({
    NEXT_PUBLIC_MODE: input.NEXT_PUBLIC_MODE ?? "mock",
    NEXT_PUBLIC_SUPABASE_URL: input.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: input.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ENABLE_EXHIBITION: input.ENABLE_EXHIBITION,
    ENABLE_VIDEO_EXPORT: input.ENABLE_VIDEO_EXPORT,
  });
}

export const env = readEnv();

export const featureFlags = {
  exhibition: env.ENABLE_EXHIBITION,
  videoExport: env.ENABLE_VIDEO_EXPORT,
};
