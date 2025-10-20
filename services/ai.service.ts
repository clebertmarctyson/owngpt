import { Role } from "@prisma/client";
import { ChatRequest } from "@/types/api.types";
import { APP_CONFIG } from "@/lib/constants";

export class AIService {
  private static readonly BASE_URL = "http://localhost:11434/api/chat";

  static async generateTitle(message: string, model: string): Promise<string> {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: Role.user,
            content: `${APP_CONFIG.titleGenerationPrompt}\n\n"${message}"`,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate title");
    }

    const data = await response.json();

    return data.message.content.trim().replace(/['"]/g, "");
  }

  static async sendMessageStream(
    request: ChatRequest
  ): Promise<ReadableStream> {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: Role.user,
            content: request.content,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    return response.body!;
  }
}
