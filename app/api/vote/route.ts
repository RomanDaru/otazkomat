import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");
    const userId = searchParams.get("userId");

    if (!questionId || !userId) {
      return NextResponse.json(
        { error: "Question ID and User ID are required" },
        { status: 400 }
      );
    }

    // Check if user has already voted on this question
    const existingVote = await prisma.vote.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
    });

    return NextResponse.json({ vote: existingVote });
  } catch (error) {
    console.error("Error checking vote:", error);
    return NextResponse.json(
      { error: "Failed to check vote" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, isPositive } = await req.json();

    if (!questionId || typeof isPositive !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Create or update vote
    const vote = await prisma.vote.upsert({
      where: {
        questionId_userId: {
          questionId,
          userId: session.user.id,
        },
      },
      update: {
        isPositive,
      },
      create: {
        questionId,
        userId: session.user.id,
        isPositive,
      },
    });

    return NextResponse.json({ success: true, vote });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
