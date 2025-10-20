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
  } catch (error: any) {
    console.error("Error in /api/chat/stream:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
