import { Message } from "@prisma/client";

import MessageItem from "./MessageItem";

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No messages yet. Start a conversation!
      </p>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </>
  );
}
