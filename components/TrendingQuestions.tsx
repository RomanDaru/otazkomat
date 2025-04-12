"use client";

import { useState, useEffect } from "react";
import { TrendingQuestion } from "@/types";
import { signIn, useSession } from "next-auth/react";
import VoteButtons from "./VoteButtons";

interface QuestionWithAnswer extends TrendingQuestion {
  answer?: string;
  isExpanded?: boolean;
  source?: string;
  questionId?: string;
  requiresLogin?: boolean;
}

export default function TrendingQuestions() {
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/trending");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched questions:", data.questions);
          setQuestions(data.questions || []);
        }
      } catch (error) {
        console.error("Error fetching trending questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionClick = async (question: QuestionWithAnswer) => {
    console.log("Question clicked:", question);
    console.log("Has answer:", !!question.answer);

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === question.id ? { ...q, isExpanded: !q.isExpanded } : q
      )
    );

    if (!question.answer) {
      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question.content }),
        });

        const data = await response.json();
        console.log("API response:", data);

        if (!response.ok) {
          if (data.requiresLogin) {
            setQuestions((prevQuestions) =>
              prevQuestions.map((q) =>
                q.id === question.id
                  ? {
                      ...q,
                      isExpanded: true,
                      requiresLogin: true,
                    }
                  : q
              )
            );
          }
          console.error("Error fetching answer:", data.error);
          return;
        }

        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === question.id
              ? {
                  ...q,
                  answer: data.answer,
                  isExpanded: true,
                  source: data.source,
                  questionId: data.questionId,
                  requiresLogin: data.requiresLogin,
                }
              : q
          )
        );
      } catch (error) {
        console.error("Error in handleQuestionClick:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className='h-8 bg-gray-800/50 rounded animate-pulse'></div>
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className='text-center text-gray-400 py-8'>
        Zatiaľ neboli položené žiadne otázky.
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {questions.map((q, index) => (
        <div
          key={q.id}
          className='group cursor-pointer p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors'>
          <div
            onClick={() => handleQuestionClick(q)}
            className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-purple-400'>
                  #{index + 1}
                </span>
                <span className='text-white group-hover:text-purple-400 transition-colors'>
                  {q.content}
                </span>
              </div>
              <div className='mt-2 flex items-center gap-2 text-sm text-gray-400'>
                <span>Opýtané {q.askCount}x</span>
                {q.isAnonymous && (
                  <span className='px-2 py-0.5 bg-gray-700/50 rounded text-xs'>
                    Anonym
                  </span>
                )}
              </div>
            </div>
          </div>
          {q.isExpanded && q.answer && (
            <div className='mt-4 pt-4 border-t border-gray-700'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-white'>Odpoveď:</h2>
                <div className='flex items-center space-x-2'>
                  <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                    {q.source || "OpenAI GPT-3.5"}
                  </span>
                  {q.askCount && (
                    <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                      Opýtané {q.askCount}x
                    </span>
                  )}
                </div>
              </div>
              <div className='space-y-4'>
                <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
                  {q.answer}
                </p>
                {q.requiresLogin && (
                  <div className='mt-6 p-4 rounded-lg'>
                    <button
                      onClick={() => signIn("google")}
                      className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-colors'>
                      <svg className='w-5 h-5' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        />
                        <path
                          fill='currentColor'
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        />
                      </svg>
                      <span>Prihlásiť sa pre ďalšie otázky</span>
                    </button>
                  </div>
                )}
                {session?.user?.id && q.questionId && (
                  <VoteButtons
                    questionId={q.questionId}
                    userId={session.user.id}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
