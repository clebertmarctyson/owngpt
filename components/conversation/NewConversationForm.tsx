"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components/providers";
import { messageSchema, MessageFormData } from "@/schema/validation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowUp } from "lucide-react";

import { AI_MODELS, DEFAULT_MODEL, API_ENDPOINTS } from "@/lib/constants";

export default function NewConversationForm() {
  const router = useRouter();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", model: DEFAULT_MODEL },
  });

  const createConversation = useMutation({
    mutationFn: async (values: MessageFormData) => {
      const res = await fetch(API_ENDPOINTS.conversations, {
        method: "POST",
        body: JSON.stringify({
          firstMessage: values.content,
          model: values.model,
        }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/conversations/${data.conversationId}?stream=true`);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          createConversation.mutate(values)
        )}
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
                  disabled={createConversation.isPending}
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
                onValueChange={(v) => field.onChange(v)}
                defaultValue={field.value}
                disabled={createConversation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.value}>
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
            disabled={createConversation.isPending}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
}
