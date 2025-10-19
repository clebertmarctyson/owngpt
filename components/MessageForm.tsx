"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowUp } from "lucide-react";

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

import { models } from "@/lib/data";
import { messageFormSchema } from "@/lib/schemas";
import { MessageFormType } from "@/lib/types";

import { createConversation } from "@/services/chatClient";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

export default function MessageForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState(models[1].value);

  const form = useForm<MessageFormType>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
      model: selectedModel,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ content, model }: MessageFormType) =>
      createConversation(content, model),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation.id],
      });

      router.push(`/conversations/${conversation.id}`);
    },
    onError: () => toast.error("Failed to create conversation"),
  });

  const onSubmit = (values: MessageFormType) => mutate(values);

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
                  className="w-full text-base p-4 resize-none rounded-lg bg-input border-border text-foreground"
                  placeholder="Type your message..."
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
                disabled={isPending}
              >
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select model" />
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
            size="icon-lg"
            className="w-8 h-8 bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
            disabled={isPending}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
}
