'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalScore: 0,
    accuracy: 0,
    questionsByDifficulty: {
      Easy: { attempted: 0, correct: 0 },
      Normal: { attempted: 0, correct: 0 },
      Hard: { attempted: 0, correct: 0 }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get stats from localStorage
    const savedStats = localStorage.getItem('quizStats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setStats({
        totalQuestions: parsedStats.attempted || 0,
        correctAnswers: parsedStats.correct || 0,
        totalScore: parsedStats.totalScore || 0,
        accuracy: parsedStats.attempted > 0 ? (parsedStats.correct / parsedStats.attempted) * 100 : 0,
        questionsByDifficulty: parsedStats.questionsByDifficulty || {
          Easy: { attempted: 0, correct: 0 },
          Normal: { attempted: 0, correct: 0 },
          Hard: { attempted: 0, correct: 0 }
        }
      });
    }
    setIsLoading(false);
  }, [router]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Normal': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const hasAttemptedQuizzes = stats.totalQuestions > 0;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Your Progress</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400">Questions Attempted</p>
              <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400">Correct Answers</p>
              <p className="text-3xl font-bold text-white">{stats.correctAnswers}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400">Total Score</p>
              <p className="text-3xl font-bold text-white">{stats.totalScore}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400">Accuracy</p>
              <p className="text-3xl font-bold text-white">
                {hasAttemptedQuizzes ? Math.round(stats.accuracy) : 0}%
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-6">Performance by Difficulty</h2>
          {hasAttemptedQuizzes ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(stats.questionsByDifficulty).map(([difficulty, data]) => (
                <div key={difficulty} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                    <span className="text-white">
                      {data.correct}/{data.attempted} correct
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: data.attempted > 0 ? `${(data.correct / data.attempted) * 100}%` : '0%' }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">
                    {data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0}% accuracy
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400">No quizzes attempted yet</p>
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/quiz"
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors block text-center"
            >
              Start New Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}