import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view history" },
        { status: 401 }
      );
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent or popular

    // Validate pagination parameters
    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 10;

    // Calculate skip for pagination
    const skip = (validatedPage - 1) * validatedPageSize;

    // Determine sort order based on query parameter
    const orderBy =
      sortBy === "popular"
        ? [{ askCount: "desc" as const }, { lastAsked: "desc" as const }]
        : [{ lastAsked: "desc" as const }, { createdAt: "desc" as const }];

    // Count total questions for pagination
    const totalQuestions = await prisma.question.count({
      where: {
        userId: session.user.id,
      },
    });

    // Find user's questions with pagination
    const questions = await prisma.question.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy,
      skip,
      take: validatedPageSize,
      select: {
        id: true,
        content: true,
        answer: true,
        askCount: true,
        lastAsked: true,
        createdAt: true,
        updatedAt: true,
        votes: {
          select: {
            isPositive: true,
          },
        },
      },
    });

    // Calculate vote summary for each question
    const questionsWithVoteSummary = questions.map((question) => {
      // TypeScript needs help with the votes array
      const votes = question.votes as { isPositive: boolean }[];
      const positiveVotes = votes.filter((vote) => vote.isPositive).length;
      const negativeVotes = votes.filter((vote) => !vote.isPositive).length;

      const { votes: _, ...questionWithoutVotes } = question;

      return {
        ...questionWithoutVotes,
        voteSummary: {
          positive: positiveVotes,
          negative: negativeVotes,
          total: positiveVotes - negativeVotes,
        },
      };
    });

    return NextResponse.json({
      questions: questionsWithVoteSummary,
      pagination: {
        page: validatedPage,
        pageSize: validatedPageSize,
        totalQuestions,
        totalPages: Math.ceil(totalQuestions / validatedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
