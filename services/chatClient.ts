import { Role } from "@prisma/client";

const API_BASE = "/api";

export async function createConversation(content: string, model: string) {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, model }),
  });

  if (!response.ok) throw new Error("Failed to create conversation");

  return response.json();
}

export async function addMessage(
  conversationId: string,
  content: string,
  role: Role
) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: { content, role } }),
  });

  if (!response.ok) throw new Error("Failed to save message");

  return response.json();
}

export async function streamResponse(
  conversationId: string,
  model: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: conversationId, model }),
  });

  if (!response.ok) throw new Error("Failed to stream responseponse");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  if (!reader) return "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.message?.content) {
            fullContent += data.message.content;
            onChunk(fullContent);
          }
        } catch {}
      }
    }
  }

  return fullContent;
}
