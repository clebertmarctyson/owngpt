"use client";

import { useState, useRef } from "react";
import { Role } from "@prisma/client";

export function useStreamMessage({
  onMessage,
  onComplete,
  onError,
}: {
  onMessage?: (content: string) => void;
  onComplete?: (finalContent: string) => void;
  onError?: (err: Error) => void;
}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  const startStream = async ({
    content,
    model,
    conversationId,
  }: {
    content: string;
    model: string;
    conversationId: string;
  }) => {
    setStreamingContent("");
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, model }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to start stream");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullContent += data.message.content;
              setStreamingContent(fullContent);
              onMessage?.(fullContent);
            }
            if (data.done) break;
          } catch {}
        }
      }

      // Save to DB
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: { content: fullContent, role: Role.assistant },
        }),
      });

      onComplete?.(fullContent);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn("Stream aborted");
      } else {
        onError?.(err);
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  };

  const stopStream = () => {
    controllerRef.current?.abort();
    setIsStreaming(false);
  };

  return {
    isStreaming,
    setIsStreaming,
    streamingContent,
    startStream,
    stopStream,
  };
}
