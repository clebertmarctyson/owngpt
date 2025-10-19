const OLLAMA_API = "http://localhost:11434/api/chat";

export async function ollamaChatRequest({
  model,
  messages,
  stream = false,
}: {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}) {
  const res = await fetch(OLLAMA_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream }),
  });

  if (!res.ok) {
    throw new Error(`Ollama request failed: ${res.statusText}`);
  }

  return res;
}
