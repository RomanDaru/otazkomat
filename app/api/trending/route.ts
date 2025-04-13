import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    // Validate pagination parameters
    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 5;

    // Calculate skip for pagination
    const skip = (validatedPage - 1) * validatedPageSize;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count total questions for pagination
    const totalQuestions = await prisma.question.count({
      where: {
        lastAsked: {
          gte: today,
        },
      },
    });

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
      skip,
      take: validatedPageSize,
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

    return NextResponse.json({
      questions: transformedQuestions,
      pagination: {
        page: validatedPage,
        pageSize: validatedPageSize,
        totalQuestions,
        totalPages: Math.ceil(totalQuestions / validatedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching trending questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending questions" },
      { status: 500 }
    );
  }
}
