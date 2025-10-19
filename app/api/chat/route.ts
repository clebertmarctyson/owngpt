import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id, model }: { id: string; model: string } = await req.json();

    const messages = await prisma.message.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10,
      where: {
        conversationId: id,
      },
      select: {
        role: true,
        content: true,
      },
    });

    // Call Ollama with streaming enabled
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: messages.reverse(),
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from Ollama");
    }

    // Create a TransformStream to handle the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });

            // Split by newlines in case multiple chunks arrived together
            const lines = chunk.split("\n").filter((line) => line.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);

                // Send the chunk to the client
                if (data.message?.content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                  );
                }

                // If it's the last chunk, close the stream
                if (data.done) {
                  controller.close();
                  return;
                }
              } catch (e) {
                // Skip invalid JSON lines
                console.error("Failed to parse chunk:", e);
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
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
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to get response" }), {
      status: 500,
    });
  }
}
