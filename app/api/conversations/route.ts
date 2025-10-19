import { NextRequest, NextResponse } from "next/server";

import { createConversation, streamChat } from "@/services/chatService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.content && body.model && !body.id) {
      const conversation = await createConversation(body.content, body.model);
      return NextResponse.json(conversation);
    }

    if (body.id && body.model) {
      const response = await streamChat(body.id, body.model);

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) return controller.close();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.message?.content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                  );
                }
                if (data.done) {
                  controller.close();
                  return;
                }
              } catch {}
            }
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
