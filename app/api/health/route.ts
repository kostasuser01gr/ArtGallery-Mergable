import { NextResponse } from "next/server";
import { env, featureFlags } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    mode: env.NEXT_PUBLIC_MODE,
    featureFlags,
    timestamp: new Date().toISOString(),
  });
}
