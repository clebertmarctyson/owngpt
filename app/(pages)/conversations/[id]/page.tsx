"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { Prisma, Role } from "@prisma/client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import CopyButton from "@/components/CopyButton";

import { toast } from "sonner";

const models = [
  { id: "1", value: "llama3:13b", name: "Llama 3 13B" },
  { id: "2", value: "llama3:8b", name: "Llama 3 8B" },
  { id: "3", value: "llama3:7b", name: "Llama 3 7B" },
];

const formSchema = z.object({
  content: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
  model: z.string().min(1, {
    message: "Model is required.",
  }),
});

type MessageStream = {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
};

import { addMessage, streamResponse } from "@/services/chatClient";

export default function ConversationDetails() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [selectedModel, setSelectedModel] = useState(models[1].value);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { data: conversation, isLoading } =
    useQuery<Prisma.ConversationGetPayload<{
      include: { messages: true };
    }> | null>({
      queryKey: ["conversation", id],
      queryFn: async () => {
        const response = await fetch(`/api/conversations/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch conversation");

        return response.json();
      },
      enabled: !!id,
      staleTime: Infinity,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      model: models[1].value,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { content, model } = values;
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      await addMessage(id as string, content, Role.user);
      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });

      const fullResponse = await streamResponse(id as string, model, (chunk) =>
        setStreamingMessage(chunk)
      );

      await addMessage(id as string, fullResponse, Role.assistant);
      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });

      form.reset({ content: "", model });
      setStreamingMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to get AI response");
    } finally {
      setIsStreaming(false);
    }
  };

  // Combine database messages with streaming message for display
  const displayMessages: MessageStream[] = [
    ...(conversation?.messages || []),
    ...(isStreaming
      ? [
          {
            id: "streaming",
            role: Role.assistant,
            content: streamingMessage,
            isStreaming: true,
          } as MessageStream,
        ]
      : []),
  ];

  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
      <Separator />

      <div className="flex flex-col gap-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {isLoading ? (
          <p className="text-muted-foreground">Loading conversation...</p>
        ) : displayMessages.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No messages yet. Start a conversation!
          </p>
        ) : (
          displayMessages.map((message) =>
            message.role === "user" ? (
              <div
                className="flex gap-4 items-start bg-secondary/30 w-fit rounded-lg p-4 border border-border/50"
                key={message.id}
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <p className="text-base text-foreground/90">
                  {message.content}
                </p>
              </div>
            ) : (
              <div key={message.id}>
                <div className="flex flex-col gap-4 py-5 px-6 bg-[#1e1e1e] rounded-2xl overflow-clip border border-[#2e2e2e] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-3xl font-bold text-primary mt-6 mb-4 border-l-4 border-primary pl-4"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-2xl font-semibold text-primary mt-5 mb-3"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-xl font-semibold text-primary mt-4 mb-2"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className="text-[15px] text-white leading-relaxed mb-3"
                          {...props}
                        />
                      ),
                      code: ({ className, children, ...props }) => (
                        <code
                          className="font-mono text-sm px-2 py-1"
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-[#151515] text-gray-100 rounded-xl p-4 overflow-x-auto mb-5 border border-[#333] shadow-inner"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside mb-4 space-y-2 ml-2 text-gray-300"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside mb-4 space-y-2 ml-2 text-gray-300"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="text-[15px] text-gray-300 leading-relaxed"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-primary/60 pl-4 py-2 my-4 italic text-gray-400 bg-[#2a2a2a]/40 rounded-md"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>

                  {!message.isStreaming && (
                    <div className="flex justify-end pt-2">
                      <CopyButton text={message.content} />
                    </div>
                  )}

                  {message.isStreaming && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-pulse">●</div>
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>
                <Separator className="my-10 opacity-40" />
              </div>
            )
          )
        )}
      </div>

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
                    className="w-full text-base p-4 resize-none line-clamp-6 overflow-hidden rounded-lg z-200 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    placeholder="Type your message here."
                    disabled={isStreaming}
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
                  disabled={isStreaming}
                >
                  <SelectTrigger className="self-end bg-input border-border text-foreground">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {models.map((model) => (
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
              className="cursor-pointer flex items-center justify-center rounded-lg w-8 h-8 bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
              disabled={isStreaming}
            >
              <ArrowUp />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
