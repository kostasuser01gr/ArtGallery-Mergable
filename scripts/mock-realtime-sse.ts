import http from "node:http";
import events from "../data/events.json";
import { PhotoEventSchema } from "../lib/types";

const parsedEvents = PhotoEventSchema.array().parse(events);
const port = 14568;

const server = http.createServer((req, res) => {
  if (req.url !== "/events") {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "content-type": "text/event-stream",
    connection: "keep-alive",
    "cache-control": "no-cache",
  });

  let index = 0;
  const timer = setInterval(() => {
    const payload = parsedEvents[index % parsedEvents.length];
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    index += 1;
  }, 3000);

  req.on("close", () => {
    clearInterval(timer);
    res.end();
  });
});

server.listen(port, () => {
  console.log(`Mock SSE listening at http://127.0.0.1:${port}/events`);
});
