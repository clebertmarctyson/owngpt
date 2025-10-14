import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });

    return new NextResponse(JSON.stringify(conversation), { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    return new NextResponse("Failed to get response", { status: 500 });
  }
}

interface Message {
  role: Role;
  content: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { message }: { message: Message } = await req.json();

    const conversation = await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        messages: {
          create: {
            role: message.role,
            content: message.content,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(conversation), { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    return new NextResponse("Failed to get response", { status: 500 });
  }
}
