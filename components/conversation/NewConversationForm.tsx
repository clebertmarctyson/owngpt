"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewConversationForm() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      model: selectedModel,
    },
  });

  const onSubmit = async (values: MessageFormData) => {
    setIsCreating(true);
    try {
      // Create conversation
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstMessage: values.content,
          model: values.model,
        }),
      });

      if (!response.ok) throw new Error("Failed to create conversation");

      const { conversationId } = await response.json();

      // Redirect to conversation page
      router.push(`/conversations/${conversationId}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create conversation");
      setIsCreating(false);
    }
  };

  return (
    // <Form {...form}>
    //   <form
    //     onSubmit={form.handleSubmit(onSubmit)}
    //     className="w-full flex flex-col gap-4"
    //   >
    //     <div className="flex gap-4 items-center">
    //       <FormField
    //         control={form.control}
    //         name="content"
    //         render={({ field }) => (
    //           <FormItem className="flex-1">
    //             <FormControl>
    //               <Textarea
    //                 {...field}
    //                 className="text-lg p-4 resize-none line-clamp-6 overflow-hidden rounded-sm"
    //                 placeholder="Type your message here."
    //                 disabled={isCreating}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <Button
    //         type="submit"
    //         variant="ghost"
    //         size="icon"
    //         disabled={isCreating}
    //       >
    //         <LucideSend size={40} />
    //       </Button>
    //     </div>

    //     <FormField
    //       control={form.control}
    //       name="model"
    //       render={({ field }) => (
    //         <Select
    //           onValueChange={(value) => {
    //             field.onChange(value);
    //             setSelectedModel(value);
    //           }}
    //           defaultValue={field.value}
    //           disabled={isCreating}
    //         >
    //           <SelectTrigger className="w-[200px]">
    //             <SelectValue placeholder="Select a model" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             {AI_MODELS.map((model) => (
    //               <SelectItem key={model.value} value={model.value}>
    //                 {model.name}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //       )}
    //     />
    //   </form>
    // </Form>

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
                  disabled={isCreating || form.formState.isSubmitting}
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
                disabled={isCreating || form.formState.isSubmitting}
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
            disabled={isCreating || form.formState.isSubmitting}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
}
