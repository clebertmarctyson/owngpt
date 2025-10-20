import { prisma } from "@/lib/prisma";
import { MessageInput } from "@/types/conversation.types";
import { Role } from "@prisma/client";

export class ConversationService {
  static async getById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
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
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(title: string, firstMessage: string) {
    return prisma.conversation.create({
      data: {
        title,
        messages: {
          create: {
            role: Role.user,
            content: firstMessage,
          },
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

  static async delete(id: string) {
    return prisma.conversation.delete({
      where: { id },
    });
  }
}
