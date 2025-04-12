"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonsProps {
  questionId: string;
  userId: string;
}

export default function VoteButtons({ questionId, userId }: VoteButtonsProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState<"positive" | "negative" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingVote = async () => {
      try {
        const response = await fetch(
          `/api/vote?questionId=${questionId}&userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.vote) {
            setHasVoted(true);
            setVoteType(data.vote.isPositive ? "positive" : "negative");
          }
        }
      } catch (error) {
        console.error("Error checking existing vote:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingVote();
  }, [questionId, userId]);

  const handleVote = async (isPositive: boolean) => {
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          isPositive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      setHasVoted(true);
      setVoteType(isPositive ? "positive" : "negative");

      return false;
    } catch (error) {
      console.error("Error submitting vote:", error);
      return false;
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!hasVoted) {
    return (
      <div className='mt-4 flex items-center justify-center space-x-4'>
        <button
          onClick={() => handleVote(true)}
          className='p-2 text-green-500 hover:bg-green-100/10 rounded-full transition-colors'
          title='Dobrá odpoveď'>
          <ThumbsUp size={24} />
        </button>
        <button
          onClick={() => handleVote(false)}
          className='p-2 text-red-500 hover:bg-red-100/10 rounded-full transition-colors'
          title='Zlá odpoveď'>
          <ThumbsDown size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className='mt-4 text-center'>
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
          voteType === "positive"
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
        {voteType === "positive" ? (
          <>
            <ThumbsUp size={18} />
            <span>Ďakujeme za pozitívne hodnotenie!</span>
          </>
        ) : (
          <>
            <ThumbsDown size={18} />
            <span>Ďakujeme za spätnú väzbu. Pokúsime sa odpoveď vylepšiť.</span>
          </>
        )}
      </div>
    </div>
  );
}
