import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view history" },
        { status: 401 }
      );
    }

    // Find user's most frequently asked questions
    const questions = await prisma.question.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          askCount: "desc",
        },
        {
          lastAsked: "desc",
        },
      ],
      take: 5,
      select: {
        id: true,
        content: true,
        askCount: true,
        lastAsked: true,
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
