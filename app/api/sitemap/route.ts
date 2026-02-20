import photos from "@/data/photos.json";
import { PhotoSchema } from "@/lib/types";

export function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const parsed = PhotoSchema.array().parse(photos);

  const urls = [
    "",
    "/gallery",
    "/exhibition",
    ...parsed.map((photo) => `/photo/${photo.id}`),
    ...parsed.map((photo) => `/photo/${photo.id}/construction`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) =>
      `  <url><loc>${baseUrl}${path}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml",
    },
  });
}
