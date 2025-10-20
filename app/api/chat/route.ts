import { NextRequest, NextResponse } from "next/server";

import { AIService } from "@/services/ai.service";

import { ChatRequest } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    const { content, model }: ChatRequest = await req.json();
    const response = await AIService.sendMessage({ content, model });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
