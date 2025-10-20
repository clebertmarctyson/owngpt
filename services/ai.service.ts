import { Role } from "@prisma/client";

import { ChatRequest, ChatResponse } from "@/types/api.types";

export class AIService {
  private static readonly BASE_URL = "http://localhost:11434/api/chat";

  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
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
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();

    return data.message;
  }
}
