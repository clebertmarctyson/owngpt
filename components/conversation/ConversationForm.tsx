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

import { AI_MODELS, API_ENDPOINTS, DEFAULT_MODEL } from "@/lib/constants";

import { Role } from "@prisma/client";

import { queryClient } from "@/components/providers";

export default function ConversationForm() {
  const { id } = useParams();

  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (values: MessageFormData) => {
      const { content, model } = values;

      await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: { content, role: Role.user },
        }),
      });

      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });

      const response = await fetch(`${API_ENDPOINTS.chat}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, model }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      return response.json();
    },
    onSuccess: async (data: { role: Role; content: string }) => {
      await fetch(`${API_ENDPOINTS.conversations}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: data }),
      });

      await queryClient.invalidateQueries({ queryKey: ["conversation", id] });

      form.reset({ content: "", model: selectedModel });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to get AI response");
    },
  });

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      model: DEFAULT_MODEL,
    },
  });

  const onSubmit = (values: MessageFormData) => {
    sendMessage(values);
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
                  className="w-full text-base p-4 resize-none line-clamp-6 overflow-hidden rounded-lg z-200"
                  placeholder="Type your message here."
                  disabled={isPending}
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
            disabled={isPending}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
}
