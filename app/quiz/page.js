'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { quizQuestions } from '../lib/quizData';
import { getGeminiResponse } from '../lib/geminiApi';
import confetti from 'canvas-confetti';

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stats, setStats] = useState({
    attempted: 0,
    correct: 0,
    totalScore: 0,
    questionsByDifficulty: {
      Easy: { attempted: 0, correct: 0 },
      Normal: { attempted: 0, correct: 0 },
      Hard: { attempted: 0, correct: 0 }
    }
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load saved stats from localStorage
    const savedStats = localStorage.getItem('quizStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, [router]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnswerSelect = async (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setShowCelebration(true);
      triggerConfetti();
      setTimeout(() => setShowCelebration(false), 2000);
    }

    // Update stats
    setStats(prev => {
      const newStats = { ...prev };
      newStats.attempted++;
      if (correct) {
        newStats.correct++;
        newStats.totalScore += currentQuestion.points;
      }
      
      // Update difficulty-specific stats
      const difficulty = currentQuestion.difficulty;
      newStats.questionsByDifficulty[difficulty].attempted++;
      if (correct) {
        newStats.questionsByDifficulty[difficulty].correct++;
      }

      // Save to localStorage
      localStorage.setItem('quizStats', JSON.stringify(newStats));
      
      return newStats;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Normal': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quiz Summary</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Total Questions</p>
                <p className="text-2xl font-bold text-white">{stats.attempted}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Correct Answers</p>
                <p className="text-2xl font-bold text-white">{stats.correct}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Total Score</p>
                <p className="text-2xl font-bold text-white">{stats.totalScore}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round((stats.correct / stats.attempted) * 100)}%
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-4">Performance by Difficulty</h3>
            <div className="space-y-4">
              {Object.entries(stats.questionsByDifficulty).map(([difficulty, data]) => (
                <div key={difficulty} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                    <span className="text-white">
                      {data.correct}/{data.attempted} correct
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(data.correct / data.attempted) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setQuizCompleted(false);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                }}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Language Quiz</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty} ({currentQuestion.points} points)
            </span>
          </div>

          <div className="mb-6">
            <p className="text-lg text-white mb-4">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    showFeedback
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-600 text-white'
                        : selectedAnswer === option
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-white'
                      : selectedAnswer === option
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div className="mb-6">
              <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                <p className="text-lg font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </p>
              </div>
              {!isCorrect && (
                <p className="text-gray-400 mt-2">
                  The correct answer is: {currentQuestion.correctAnswer}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </p>
            {showFeedback && (
              <button
                onClick={handleNextQuestion}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}