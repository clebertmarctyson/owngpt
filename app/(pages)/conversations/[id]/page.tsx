"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import MessageList from "@/components/conversation/MessageList";
import ConversationForm from "@/components/conversation/ConversationForm";
import { ArrowDown, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Role } from "@prisma/client";
import { API_ENDPOINTS, DEFAULT_MODEL } from "@/lib/constants";
import { useStreamMessage } from "@/hooks/useStreamMessage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ConversationDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const shouldStream = searchParams.get("stream") === "true";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const {
    data: conversation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINTS.conversations}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!id,
  });

  const {
    isStreaming,
    setIsStreaming,
    streamingContent,
    startStream,
    stopStream,
  } = useStreamMessage({
    onComplete: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
    onError: () => toast.error("Failed to stream AI response"),
  });

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAtBottom && conversation?.messages) scrollToBottom();
  }, [conversation?.messages, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsAtBottom(isNearBottom);
  };

  // Auto start streaming for new conversation
  useEffect(() => {
    const autoStream = async () => {
      if (
        shouldStream &&
        conversation &&
        conversation.messages.length === 1 &&
        conversation.messages[0].role === Role.user
      ) {
        await startStream({
          content: conversation.messages[0].content,
          model: DEFAULT_MODEL,
          conversationId: conversation.id,
        });
      }
    };
    autoStream();
  }, [shouldStream, conversation]);

  if (isLoading)
    return (
      <div className="w-[50vw] h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );

  if (isError || !conversation)
    return (
      <div className="w-[50vw] h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found.</p>
      </div>
    );

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

      {/* Stop + Scroll buttons */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            className="fixed bottom-[44%] right-[10%] flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Button
              onClick={stopStream}
              variant="destructive"
              size="icon"
              className="w-12 h-12 rounded-full"
              title="Stop response"
            >
              <Square size={20} />
            </Button>
            {!isAtBottom && (
              <Button
                onClick={scrollToBottom}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full"
              >
                <ArrowDown size={25} />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConversationForm
        conversationId={id}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        startStream={startStream}
      />
    </div>
  );
}
