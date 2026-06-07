// app/api/events/route.ts
// Server-Sent Events stream — pushes live APC events to connected clients.
// Each chunk is a JSON-encoded APCEvent prefixed with "data: " per the SSE spec.
// The stream polls the in-memory event bus every 2 seconds and sends new events
// since the last sent index. Works in long-running Node.js processes and Vercel
// serverless edge; clients should reconnect on close (EventSource does this automatically).
import { getLiveEvents } from "@/lib/events/liveEventEmitter";

export const runtime = "nodejs";
// Keep the stream alive for up to 5 minutes before the client reconnects.
export const maxDuration = 300;

export async function GET() {
  let lastIndex = 0;

  const stream = new ReadableStream({
    start(controller) {
      // Send an initial "connected" heartbeat
      controller.enqueue(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);
    },
    async pull(controller) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const events = getLiveEvents();
      const newEvents = events.slice(lastIndex);

      if (newEvents.length > 0) {
        lastIndex = events.length;
        for (const event of newEvents) {
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        }
      } else {
        // Heartbeat to keep the connection alive
        controller.enqueue(`: heartbeat\n\n`);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
