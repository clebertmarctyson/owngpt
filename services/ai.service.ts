import { Role } from "@prisma/client";
import { ChatRequest } from "@/types/api.types";
import { APP_CONFIG } from "@/lib/constants";

export class AIService {
  private static readonly BASE_URL = "http://localhost:11434/api/chat";

  static async generateTitle(message: string, model: string): Promise<string> {
    try {
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
        throw new Error(`Failed to generate title: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.message?.content) {
        throw new Error("Invalid response from AI service");
      }

      return data.message.content.trim().replace(/['"]/g, "");
    } catch (error) {
      console.error("Error generating title:", error);
      // Fallback to first 50 characters of message
      return message.substring(0, 50) + (message.length > 50 ? "..." : "");
    }
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
        messages: [{ role: Role.user, content: request.content }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get AI response: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    return response.body;
  }
}
