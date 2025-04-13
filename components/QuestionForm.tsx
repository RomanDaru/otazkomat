"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import VoteButtons from "./VoteButtons";

// Define maximum character limit
const MAX_CHAR_LIMIT = 500;

interface Answer {
  answer: string;
  score: number;
  source: string;
  requiresLogin?: boolean;
  questionId?: string;
  askCount?: number;
}

export default function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleQuestionAnswered = (event: CustomEvent) => {
      setAnswer(event.detail);
    };

    window.addEventListener(
      "questionAnswered",
      handleQuestionAnswered as EventListener
    );

    return () => {
      window.removeEventListener(
        "questionAnswered",
        handleQuestionAnswered as EventListener
      );
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRequiresLogin(false);

    // Only reset answer if we're asking a new question
    if (!answer) {
      setAnswer(null);
    }

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.requiresLogin) {
          setRequiresLogin(true);
          setError(data.error);
        } else {
          throw new Error(data.error || "Failed to get answer");
        }
        return;
      }

      setAnswer(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to get answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='relative'>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder='Sem napíš svoju otázku...'
          className='w-full p-4 pb-4 bg-gray-800 text-white rounded-xl border border-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-colors'
          required
          maxLength={MAX_CHAR_LIMIT}
        />
        <div className='flex justify-between items-start mt-2'>
          <p className='text-xs text-gray-400 italic'>
            * Otázky pre vás generuje ChatGPT ktorý nemusí byť vždy presný,
            dôležité otázky si vždy overte!
          </p>
          <span
            className={`text-xs transition-colors ${
              question.length > MAX_CHAR_LIMIT * 0.95
                ? "text-red-400"
                : question.length > MAX_CHAR_LIMIT * 0.8
                ? "text-yellow-400"
                : "text-gray-400"
            }`}>
            {question.length}/{MAX_CHAR_LIMIT}
          </span>
        </div>
        <button
          type='submit'
          disabled={loading}
          className={`absolute bottom-[3.2rem] right-4 px-6 py-2 rounded-xl transition-all duration-200 ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          }`}>
          {loading ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Hľadám odpoveď...
            </span>
          ) : (
            "Opýtaj sa"
          )}
        </button>
      </div>

      {error && (
        <div className='bg-red-900/50 text-white p-6 rounded-xl border border-red-800'>
          <div className='space-y-4'>
            <p className='text-red-200'>{error}</p>
            {requiresLogin && (
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
            )}
          </div>
        </div>
      )}

      {answer && (
        <div className='bg-gray-800 text-white p-6 rounded-xl border border-gray-700'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold text-white'>Odpoveď:</h2>
            <div className='flex items-center space-x-2'>
              <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                {answer.source}
              </span>
              {answer.askCount && (
                <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                  Opýtané {answer.askCount}x
                </span>
              )}
            </div>
          </div>
          <div className='space-y-4'>
            <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
              {answer.answer}
            </p>
            {answer.requiresLogin && (
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
            {session?.user?.id && answer.questionId && (
              <VoteButtons
                questionId={answer.questionId}
                userId={session.user.id}
              />
            )}
          </div>
        </div>
      )}
    </form>
  );
}
