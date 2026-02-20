import events from "@/data/events.json";
import { PhotoEventSchema } from "@/lib/types";

const parsedEvents = PhotoEventSchema.array().parse(events);

export const dynamic = "force-dynamic";

export function GET() {
  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let index = 0;
      interval = setInterval(() => {
        const event = parsedEvents[index % parsedEvents.length];
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        index += 1;
      }, 3000);

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: keep-alive\n\n`));
      }, 10000);
    },
    cancel() {
      if (interval) {
        clearInterval(interval);
      }
      if (heartbeat) {
        clearInterval(heartbeat);
      }
      return undefined;
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
