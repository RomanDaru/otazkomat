import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find questions asked today, sorted by ask count
    const questions = await prisma.question.findMany({
      where: {
        lastAsked: {
          gte: today,
        },
      },
      orderBy: [
        {
          askCount: "desc",
        },
        {
          lastAsked: "desc",
        },
      ],
      take: 10,
      select: {
        id: true,
        content: true,
        answer: true,
        askCount: true,
        userId: true,
        votes: true,
      },
    });

    // Transform the response to indicate if questions are from anonymous users
    const transformedQuestions = questions.map((question) => ({
      id: question.id,
      content: question.content,
      answer: question.answer,
      askCount: question.askCount,
      isAnonymous: question.userId === null,
      questionId: question.id,
      source: "OpenAI GPT-3.5",
      isExpanded: false,
    }));

    return NextResponse.json({ questions: transformedQuestions });
  } catch (error) {
    console.error("Error fetching trending questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending questions" },
      { status: 500 }
    );
  }
}
