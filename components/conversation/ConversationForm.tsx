"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { messageSchema, MessageFormData } from "@/schema/validation.schema";
import { AI_MODELS, DEFAULT_MODEL } from "@/lib/constants";
import { Role } from "@prisma/client";

export default function ConversationForm() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (values: MessageFormData) => {
      const { content, model } = values;

      // Add user message
      await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: { content, role: Role.user },
        }),
      });

      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });

      // Get streaming response
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, model }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      return response.body;
    },
    onSuccess: async (stream) => {
      if (!stream) return;

      setIsStreaming(true);
      setStreamingContent("");

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                fullContent += data.message.content;
                setStreamingContent(fullContent);
              }
              if (data.done) {
                break;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }

        // Save complete message
        await fetch(`/api/conversations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: { content: fullContent, role: Role.assistant },
          }),
        });

        await queryClient.invalidateQueries({ queryKey: ["conversation", id] });
        form.reset({ content: "", model: selectedModel });
        setStreamingContent("");
      } catch (error) {
        console.error("Streaming error:", error);
        toast.error("Failed to stream response");
      } finally {
        setIsStreaming(false);
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to get AI response");
      setIsStreaming(false);
    },
  });

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      model: selectedModel,
    },
  });

  const onSubmit = (values: MessageFormData) => {
    sendMessage(values);
  };

  return (
    <>
      {isStreaming && streamingContent && (
        <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">AI is typing...</p>
          <p className="text-foreground">{streamingContent}</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full text-base p-4 resize-none line-clamp-6 overflow-hidden rounded-lg z-200"
                    placeholder="Type your message here."
                    disabled={isPending || isStreaming}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4 w-full">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedModel(value);
                  }}
                  defaultValue={field.value}
                  disabled={isPending || isStreaming}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Button
              type="submit"
              variant="outline"
              size="icon-lg"
              disabled={isPending || isStreaming}
            >
              <ArrowUp />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
