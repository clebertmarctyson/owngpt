"use client";

import { Role } from "@prisma/client";

export default function MessageList({
  messages,
}: {
  messages: { id: string; role: Role; content: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 rounded-2xl border ${
            msg.role === Role.user
              ? "bg-blue-950/30 border-blue-900 self-end text-right"
              : "bg-[#1e1e1e] border-[#2e2e2e] self-start text-left"
          }`}
        >
          <p className="whitespace-pre-wrap text-foreground text-sm">
            {msg.content}
          </p>
        </div>
      ))}
    </div>
  );
}
