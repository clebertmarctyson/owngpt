import { NextRequest } from "next/server";
import { AIService } from "@/services/ai.service";
import { ChatRequest } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const { content, model }: ChatRequest = await req.json();

    const stream = await AIService.sendMessageStream({ content, model });

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
