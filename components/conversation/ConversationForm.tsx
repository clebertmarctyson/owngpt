"use client";

import { useState } from "react";
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

export default function ConversationForm({
  conversationId,
  isStreaming,
  setIsStreaming,
  startStream,
}: {
  conversationId: string;
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  startStream: (args: {
    content: string;
    model: string;
    conversationId: string;
  }) => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", model: selectedModel },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: MessageFormData) => {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: { content: values.content, role: Role.user },
        }),
      });
      await queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
      return values;
    },
    onSuccess: async (values) => {
      await startStream({
        content: values.content,
        model: values.model,
        conversationId,
      });
      form.reset({ content: "", model: selectedModel });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const onSubmit = (values: MessageFormData) => {
    if (isStreaming || isPending) return;
    mutate(values);
  };

  return (
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
                  className="w-full text-base p-4 resize-none rounded-lg"
                  placeholder="Type your message here..."
                  disabled={isPending || isStreaming}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
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
                onValueChange={(v) => {
                  field.onChange(v);
                  setSelectedModel(v);
                }}
                defaultValue={field.value}
                disabled={isPending || isStreaming}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.value}>
                      {m.name}
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
  );
}
