import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Check if this question has been asked before (case-insensitive)
    const existingQuestion = await prisma.question.findFirst({
      where: {
        content: {
          equals: question,
        },
      },
      include: {
        votes: true,
      },
    });

    // If question exists, return the answer regardless of login status
    if (existingQuestion) {
      // Update ask count and last asked time
      const updatedQuestion = await prisma.question.update({
        where: { id: existingQuestion.id },
        data: {
          askCount: { increment: 1 },
          lastAsked: new Date(),
        },
      });

      const positiveVotes = existingQuestion.votes.filter(
        (vote) => vote.isPositive
      ).length;
      const negativeVotes = existingQuestion.votes.filter(
        (vote) => !vote.isPositive
      ).length;

      // If the existing answer has more negative votes, generate a new one
      if (negativeVotes > positiveVotes && session?.user?.id) {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides accurate and concise answers to everyday questions. Answer in Slovak language. Keep your answers clear and to the point.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: "text" },
        });

        const newAnswer = completion.choices[0]?.message?.content;

        if (!newAnswer) {
          throw new Error("No answer generated");
        }

        // Update the answer
        await prisma.question.update({
          where: { id: existingQuestion.id },
          data: {
            answer: newAnswer,
          },
        });

        return NextResponse.json({
          answer: newAnswer,
          score: 1,
          source: "OpenAI GPT-3.5",
          questionId: existingQuestion.id,
          askCount: updatedQuestion.askCount,
        });
      }

      // Return the existing answer
      return NextResponse.json({
        answer: existingQuestion.answer,
        score: 1,
        source: "OpenAI GPT-3.5",
        questionId: existingQuestion.id,
        askCount: updatedQuestion.askCount,
      });
    }

    // For new questions, check if user is allowed to ask
    if (!session?.user?.id) {
      const hasAskedFreeQuestion = cookieStore.get("askedFreeQuestion");
      if (hasAskedFreeQuestion) {
        return NextResponse.json(
          {
            error:
              "Pre ďalšie otázky sa, prosím, prihláste pomocou Google účtu.",
            requiresLogin: true,
          },
          { status: 403 }
        );
      }
    }

    // Get answer from OpenAI for new question
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides accurate and concise answers to everyday questions. Answer in Slovak language. Keep your answers clear and to the point.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "text" },
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      throw new Error("No answer generated");
    }

    // Create new question
    const newQuestion = await prisma.question.create({
      data: {
        content: question,
        answer: answer,
        userId: session?.user?.id || null,
        askCount: 1,
        lastAsked: new Date(),
      },
    });

    // If user is logged in, return normal response
    if (session?.user?.id) {
      return NextResponse.json({
        answer,
        score: 1,
        source: "OpenAI GPT-3.5",
        questionId: newQuestion.id,
        askCount: 1,
      });
    }

    // For non-logged in users, set the cookie and return the answer with a login prompt
    const response = NextResponse.json({
      answer:
        answer +
        "\n\nPre ďalšie otázky sa, prosím, prihláste pomocou Google účtu. Prihlásení používatelia majú prístup k histórii svojich otázok a ďalším funkciám.",
      score: 1,
      source: "OpenAI GPT-3.5",
      requiresLogin: true,
      questionId: newQuestion.id,
      askCount: 1,
    });

    // Set a cookie to track that they've asked their free question
    response.cookies.set("askedFreeQuestion", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error processing question:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
