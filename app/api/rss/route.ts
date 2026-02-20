import photos from "@/data/photos.json";
import { PhotoSchema } from "@/lib/types";

export function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const parsed = PhotoSchema.array().parse(photos).filter((photo) => photo.published);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Construction Animation Gallery</title>
    <link>${baseUrl}/gallery</link>
    <description>Published construction photo composites</description>
    ${parsed
      .map(
        (photo) => `<item>
      <title>${photo.title}</title>
      <link>${baseUrl}/photo/${photo.id}</link>
      <description>${photo.description}</description>
      <pubDate>${new Date(photo.createdAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml",
    },
  });
}
