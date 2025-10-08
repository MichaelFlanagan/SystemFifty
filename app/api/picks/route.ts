import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Return the most recent pick (Today's Pick)
    const pick = await prisma.pick.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pick);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pick" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const pick = await prisma.pick.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(pick);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create pick" },
      { status: 500 }
    );
  }
}
