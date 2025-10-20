import { NextRequest, NextResponse } from "next/server";
import { ConversationService } from "@/services/conversation.service";
import { AIService } from "@/services/ai.service";
import { CreateConversationInput } from "@/types/conversation.types";

export async function POST(req: NextRequest) {
  try {
    const { firstMessage, model }: CreateConversationInput = await req.json();

    // Generate title
    const title = await AIService.generateTitle(firstMessage, model);

    // Create conversation with first message
    const conversation = await ConversationService.create(title, firstMessage);

    return NextResponse.json(
      { conversationId: conversation.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
