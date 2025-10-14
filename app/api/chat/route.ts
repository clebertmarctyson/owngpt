import { NextRequest, NextResponse } from "next/server";

import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { content, model } = await req.json();

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: Role.user,
            content: content,
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data.message, { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
