import { WebSocketServer } from "ws";
import events from "../data/events.json";
import { PhotoEventSchema } from "../lib/types";

const parsedEvents = PhotoEventSchema.array().parse(events);
const port = 14567;
const wss = new WebSocketServer({ port });

wss.on("connection", (socket) => {
  let index = 0;
  const interval = setInterval(() => {
    const event = parsedEvents[index % parsedEvents.length];
    socket.send(JSON.stringify(event));
    index += 1;
  }, 3000);

  socket.on("close", () => clearInterval(interval));
});

console.log(`Mock websocket listening on ws://127.0.0.1:${port}`);
