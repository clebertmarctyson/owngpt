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
