import { Conversation, Message, Role } from "@prisma/client";

export type ConversationWithMessages = Conversation & {
  messages: Message[];
};

export type MessageInput = {
  role: Role;
  content: string;
};

export type ConversationListItem = Pick<
  Conversation,
  "id" | "title" | "createdAt"
>;

export type CreateConversationInput = {
  firstMessage: string;
  model: string;
};

export type StreamChunk = {
  content?: string;
  done?: boolean;
  error?: string;
};
