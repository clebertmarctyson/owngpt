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

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("search");
  const limit = req.nextUrl.searchParams.get("limit");

  try {
    const conversations = query
      ? await ConversationService.search(query)
      : limit
      ? await ConversationService.getRecent(parseInt(limit))
      : await ConversationService.getAll();
    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("Error getting conversations:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}
