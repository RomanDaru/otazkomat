"use client";

import { useEffect, useState } from "react";
import TrendingQuestions from "./TrendingQuestions";
import VoteButtons from "./VoteButtons";
import { useSession } from "next-auth/react";

interface UserQuestion {
  id: string;
  content: string;
  answer?: string;
  askCount: number;
  lastAsked: string;
  createdAt?: string;
  updatedAt?: string;
  isExpanded?: boolean;
  voteSummary?: {
    positive: number;
    negative: number;
    total: number;
  };
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalQuestions: number;
  totalPages: number;
}

interface UserHistoryProps {
  showMyQuestionsOnly?: boolean;
}

export default function UserHistory({
  showMyQuestionsOnly = false,
}: UserHistoryProps) {
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrending, setShowTrending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (showTrending) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/history?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}`
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch questions");
        }
        const data = await res.json();
        setQuestions(data.questions);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch questions"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showTrending, currentPage, pageSize, sortBy]);

  const handleQuestionClick = async (question: UserQuestion) => {
    if (question.answer) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === question.id ? { ...q, isExpanded: !q.isExpanded } : q
        )
      );
      return;
    }

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.content }),
      });

      const data = await response.json();

      if (!response.ok) {
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
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error in handleQuestionClick:", error);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
      setCurrentPage(newPage);
    }
  };

  const toggleSortBy = () => {
    setSortBy((current) => (current === "recent" ? "popular" : "recent"));
  };

  // For dedicated My Questions page, don't show trending toggle
  const showToggle = !showMyQuestionsOnly;

  return (
    <div className='bg-gray-800 rounded-xl p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2
          className={`text-lg font-semibold ${
            showTrending ? "text-blue-400" : "text-purple-400"
          }`}>
          {showTrending ? "Najčastejšie otázky dňa" : "Vaše časté otázky"}
        </h2>
        <div className='flex space-x-2'>
          {!showTrending && (
            <button
              onClick={toggleSortBy}
              className='text-sm px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors'>
              {sortBy === "recent"
                ? "Zobraziť najpopulárnejšie"
                : "Zobraziť najnovšie"}
            </button>
          )}
          {showToggle && (
            <button
              onClick={() => setShowTrending(!showTrending)}
              className='text-sm px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors'>
              {showTrending ? "Zobraziť moje otázky" : "Zobraziť trendy"}
            </button>
          )}
        </div>
      </div>

      {showTrending ? (
        <TrendingQuestions />
      ) : loading ? (
        <div className='animate-pulse space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-4 bg-gray-700 rounded'></div>
          ))}
        </div>
      ) : error ? (
        <div className='text-red-400 text-sm p-4 bg-red-900/20 rounded-lg border border-red-900/50'>
          {error}
        </div>
      ) : questions.length > 0 ? (
        <>
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
                        #{(currentPage - 1) * pageSize + index + 1}
                      </span>
                      <span className='text-white group-hover:text-purple-400 transition-colors'>
                        {q.content}
                      </span>
                    </div>
                    <div className='mt-2 flex items-center gap-2 text-sm text-gray-400'>
                      <span>Opýtané {q.askCount}x</span>
                      <span className='text-xs text-gray-500'>
                        {new Date(q.lastAsked).toLocaleDateString()}
                      </span>
                      {q.voteSummary && (
                        <span className='text-xs'>
                          <span
                            className={
                              q.voteSummary.total > 0
                                ? "text-green-400"
                                : q.voteSummary.total < 0
                                ? "text-red-400"
                                : "text-gray-400"
                            }>
                            {q.voteSummary.total > 0 ? "+" : ""}
                            {q.voteSummary.total}
                          </span>{" "}
                          hodnotení
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {q.isExpanded && q.answer && (
                  <div className='mt-4 pt-4 border-t border-gray-700'>
                    <div className='flex justify-between items-center mb-4'>
                      <h2 className='text-lg font-semibold text-white'>
                        Odpoveď:
                      </h2>
                      <div className='flex items-center space-x-2'>
                        <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                          OpenAI GPT-3.5
                        </span>
                        <span className='px-3 py-1 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full'>
                          Opýtané {q.askCount}x
                        </span>
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
                        {q.answer}
                      </p>
                      {session?.user?.id && (
                        <VoteButtons
                          questionId={q.id}
                          userId={session.user.id}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex justify-center items-center space-x-2 mt-6'>
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}>
                &larr;
              </button>

              <span className='text-gray-400 text-sm'>
                Strana {currentPage} z {pagination.totalPages}
              </span>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}>
                &rarr;
              </button>
            </div>
          )}
        </>
      ) : (
        <p className='text-gray-400 text-sm'>Zatiaľ žiadne otázky v histórii</p>
      )}
    </div>
  );
}
