"use client";

import { Copy, LucideSend } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { toast } from "sonner";

import { useParams } from "next/navigation";

import { Conversation, conversations } from "@/data/data";

import { Message } from "@/data/data";

const ConversationDetails = () => {
  const { id }: { id: string } = useParams();

  const conversation: Conversation = conversations.find(
    (conversation: Conversation) => conversation.id === Number(id)
  ) as Conversation;

  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-4">
      {/* Display area */}
      <div className="flex flex-col gap-4 p-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {conversation?.messages?.map((message: Message) =>
          message.role === "user" ? (
            <div
              className="flex gap-4 items-start bg-secondary w-fit rounded-sm p-4"
              key={message.id}
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-lg">{message.content}</p>
            </div>
          ) : (
            <div key={message.id}>
              <div className="flex flex-col gap-4 py-4 bg-secondary/25 rounded-sm p-4 overflow-clip">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                <Copy
                  className="cursor-pointer self-end"
                  size={30}
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    toast("Copied to clipboard");
                  }}
                />
              </div>
              <Separator className="my-8" />
            </div>
          )
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-4 items-center w-[100%] absolute bottom-8 left-[50%] -translate-x-[50%] rounded-sm bg-background">
        <Textarea
          className="text-lg p-4 resize-none line-clamp-6 overflow-hidden rounded-sm bg-green-400 z-100"
          placeholder="Type your message here."
        />
        <LucideSend className="cursor-pointer" size={40} />
      </div>
    </div>
  );
};

export default ConversationDetails;
