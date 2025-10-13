import { LucideSend } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { Message } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import CopyButton from "@/components/CopyButton";

const ConversationDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: (await params).id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

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
                <CopyButton text={message?.content} />
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
