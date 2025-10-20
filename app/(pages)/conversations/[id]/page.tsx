"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import MessageList from "@/components/conversation/MessageList";
import ConversationForm from "@/components/conversation/ConversationForm";

import { ArrowDown, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

import { Role } from "@prisma/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { queryClient } from "@/components/providers";

type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export default function ConversationDetails() {
  const { id } = useParams<{ id: string }>();

  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // ✅ Fetch conversation with React Query
  const {
    data: conversation,
    isLoading,
    isError,
  } = useQuery<Conversation>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINTS.conversations}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!id,
  });

  // ✅ Mutation to add message to conversation (used after stream ends)
  const addMessageMutation = useMutation({
    mutationFn: async (message: { content: string; role: Role }) => {
      const res = await fetch(`${API_ENDPOINTS.conversations}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to save message");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });
      setStreamingContent("");
    },
  });

  // ✅ Handle AI streaming
  const startStreaming = useCallback(
    async (userMessage: string) => {
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const response = await fetch(`${API_ENDPOINTS.chat}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMessage, model: "llama3:8b" }),
        });

        if (!response.ok) throw new Error("Failed to stream AI response");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                fullContent += data.message.content;
                setStreamingContent(fullContent);
              }
              if (data.done) break;
            } catch {
              // ignore invalid JSON chunks
            }
          }
        }

        // ✅ Save assistant message using mutation
        await addMessageMutation.mutateAsync({
          role: Role.assistant,
          content: fullContent,
        });
      } catch (error) {
        console.error("Streaming error:", error);
      } finally {
        setIsStreaming(false);
      }
    },
    [id, addMessageMutation]
  );

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  // ✅ Automatically start streaming if only one user message exists
  if (conversation && conversation.messages.length === 1) {
    const firstMsg = conversation.messages[0];
    if (firstMsg.role === Role.user && !isStreaming) {
      startStreaming(firstMsg.content);
    }
  }

  // ✅ Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Auto-scroll when new messages arrive
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [conversation?.messages, streamingContent]);

  // ✅ Detect manual scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsAtBottom(isNearBottom);
  };

  // ✅ Loading / Error states
  if (isLoading) {
    return (
      <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  if (isError || !conversation) {
    return (
      <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8">
        <p className="text-muted-foreground">Conversation not found.</p>
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-10">
      <Separator />

      <div
        onScroll={handleScroll}
        className="relative flex flex-col gap-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar"
      >
        <MessageList messages={conversation.messages} />

        {isStreaming && streamingContent && (
          <div className="p-4 bg-[#1e1e1e] rounded-2xl border border-[#2e2e2e]">
            <p className="text-sm text-muted-foreground mb-2">
              AI is typing...
            </p>
            <div className="text-foreground whitespace-pre-wrap">
              {streamingContent}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="w-12 h-12 flex items-center justify-center cursor-pointer fixed top-[44%] right-[10%] bg-accent text-foreground p-1 rounded-full shadow-lg border border-border hover:scale-110 transition-transform">
        <StopCircle size={25} onClick={() => stopStreaming()} />
      </div>

      <AnimatePresence>
        {!isAtBottom && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToBottom}
            className="w-12 h-12 flex items-center justify-center cursor-pointer fixed bottom-[44%] right-[10%] bg-accent text-foreground p-1 rounded-full shadow-lg border border-border hover:scale-110 transition-transform"
          >
            <ArrowDown size={25} />
          </motion.button>
        )}
      </AnimatePresence>

      <ConversationForm />
    </div>
  );
}
