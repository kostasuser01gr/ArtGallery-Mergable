import { NextRequest } from "next/server";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title") ?? "Construction Animation Studio";
  const safeTitle = escapeXml(title);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#051018" />
      <stop offset="100%" stop-color="#122a35" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)" />
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.2)" />
  <text x="80" y="290" font-size="64" fill="#d7f9ff" font-family="Georgia, serif">${safeTitle}</text>
  <text x="80" y="350" font-size="30" fill="#a2dbe8" font-family="Arial, sans-serif">Cinematic Construction Sequence</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=3600",
    },
  });
}
