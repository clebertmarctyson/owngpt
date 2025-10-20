import { prisma } from "@/lib/prisma";

import { MessageInput } from "@/types/conversation.types";

export class ConversationService {
  static async getById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });
  }

  static async getRecent(limit: number = 20) {
    return prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async search(query: string) {
    return prisma.conversation.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    });
  }

  static async addMessage(conversationId: string, message: MessageInput) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          create: {
            role: message.role,
            content: message.content,
          },
        },
      },
    });
  }

  static async deleteConversation(conversationId: string) {
    return prisma.conversation.delete({
      where: { id: conversationId },
    });
  }
}
