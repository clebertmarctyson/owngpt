"use client";

import { Message } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CopyButton from "@/components/CopyButton";

const markdownComponents = {
  h1: ({ ...props }: any) => (
    <h1
      className="text-3xl font-bold text-primary mt-6 mb-4 border-l-4 border-primary pl-4"
      {...props}
    />
  ),
  h2: ({ ...props }: any) => (
    <h2 className="text-2xl font-semibold text-primary mt-5 mb-3" {...props} />
  ),
  h3: ({ ...props }: any) => (
    <h3 className="text-xl font-semibold text-primary mt-4 mb-2" {...props} />
  ),
  p: ({ ...props }: any) => (
    <p className="text-[15px] text-white leading-relaxed mb-3" {...props} />
  ),
  code: ({ className, children, ...props }: any) => (
    <code className="font-mono text-sm px-2 py-1" {...props}>
      {children}
    </code>
  ),
  pre: ({ ...props }: any) => (
    <pre
      className="bg-[#151515] text-gray-100 rounded-xl p-4 overflow-x-auto mb-5 border border-[#333] shadow-inner"
      {...props}
    />
  ),
  ul: ({ ...props }: any) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 ml-2 text-gray-300"
      {...props}
    />
  ),
  ol: ({ ...props }: any) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 ml-2 text-gray-300"
      {...props}
    />
  ),
  li: ({ ...props }: any) => (
    <li className="text-[15px] text-gray-300 leading-relaxed" {...props} />
  ),
  blockquote: ({ ...props }: any) => (
    <blockquote
      className="border-l-4 border-primary/60 pl-4 py-2 my-4 italic text-gray-400 bg-[#2a2a2a]/40 rounded-md"
      {...props}
    />
  ),
  table: ({ ...props }: any) => (
    <table
      className="w-full border-collapse my-4 text-sm text-gray-300"
      {...props}
    />
  ),
  thead: ({ ...props }: any) => <thead className="bg-[#252525]" {...props} />,
  th: ({ ...props }: any) => (
    <th
      className="border border-[#3a3a3a] px-4 py-2 text-left text-primary font-semibold"
      {...props}
    />
  ),
  td: ({ ...props }: any) => (
    <td
      className="border border-[#3a3a3a] px-4 py-2 text-gray-300"
      {...props}
    />
  ),
  a: ({ ...props }: any) => (
    <a
      className="text-blue-400 hover:text-blue-300 underline transition-colors"
      {...props}
    />
  ),
  hr: ({ ...props }: any) => (
    <hr className="my-6 border-[#2f2f2f]" {...props} />
  ),
};

export default function MessageItem({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex gap-4 items-start bg-secondary/30 w-fit rounded-lg p-4 border border-border/50">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <p className="text-base text-foreground/90">{message.content}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 py-5 px-6 bg-[#1e1e1e] rounded-2xl overflow-clip border border-[#2e2e2e] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {message.content}
        </ReactMarkdown>

        <div className="flex justify-end pt-2">
          <CopyButton text={message.content} />
        </div>
      </div>

      <Separator className="my-10 opacity-40" />
    </div>
  );
}
