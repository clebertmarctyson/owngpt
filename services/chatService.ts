import { prisma } from "@/lib/prisma";
import { ollamaChatRequest } from "@/lib/ollama";
import { Role } from "@prisma/client";

export async function getConversationTitle(content: string, model: string) {
  const response = await ollamaChatRequest({
    model,
    messages: [
      {
        role: "user",
        content: `Please generate a title for the following 
            conversation content: ${content}. 
            Note: The title should be short and concise, ideally less than 20 words.
            Also, I don't need suggestions. I just want the title.
            Don't add any other text, just the title without any other information.
            The title should be a single line.`,
      },
    ],
  });

  const json = await response.json();
  return json?.message?.content?.trim() ?? "Untitled Conversation";
}

export async function createConversation(content: string, model: string) {
  const title = await getConversationTitle(content, model);

  return await prisma.conversation.create({
    data: {
      title,
      messages: {
        create: {
          role: Role.user,
          content,
        },
      },
    },
  });
}

export async function streamChat(conversationId: string, model: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { id: "asc" },
    select: { role: true, content: true },
  });

  const response = await ollamaChatRequest({
    model,
    messages,
    stream: true,
  });

  return response;
}
