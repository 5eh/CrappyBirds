"use client";

import { useEffect, useState } from "react";

const DEFAULT_SCORES: GameScore[] = [
  {
    score: 42,
    timestamp: "2024-11-27T14:23:45.123Z",
    skinUsed: "bird flat",
  },
  {
    score: 27,
    timestamp: "2024-11-27T13:15:30.123Z",
    skinUsed: "bird flat",
  },
  {
    score: 35,
    timestamp: "2024-11-27T12:05:20.123Z",
    skinUsed: "bird flat",
  },
];

interface GameScore {
  score: number;
  timestamp: string;
  skinUsed: string;
}

const ScoreCard = ({ score, timestamp, skinUsed }: GameScore) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-gray-700/30 hover:bg-gray-800/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-primary/20 rounded-full p-3 h-12 w-12 flex items-center justify-center">
          <span className="text-lg font-bold">{score}</span>
        </div>
        <div>
          <p className="font-medium">
            {new Date(timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-400">{new Date(timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 relative">
          <img
            src={`/img/${skinUsed.toLowerCase().replace(" ", "-")}.png`}
            alt={skinUsed}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-sm text-gray-400">{skinUsed}</span>
      </div>
    </div>
  );
};

const ScoreHistory = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [bestScore, setBestScore] = useState<GameScore | null>(null);
  const [averageScore, setAverageScore] = useState<number>(0);

  useEffect(() => {
    // Load scores from localStorage or use defaults if none exist
    const savedScores = localStorage.getItem("gameScores");
    const initialScores = savedScores ? JSON.parse(savedScores) : DEFAULT_SCORES;

    setScores(initialScores);

    // Calculate stats
    if (initialScores.length > 0) {
      const highest = initialScores.reduce(
        (max: GameScore, score: GameScore) => (score.score > max.score ? score : max),
        initialScores[0],
      );
      setBestScore(highest);

      const avg = initialScores.reduce((sum: number, score: GameScore) => sum + score.score, 0) / initialScores.length;
      setAverageScore(Math.round(avg));
    }
  }, []);

  return (
    <div className="w-full bg-gray-900/20 rounded-lg p-6">
      <div className="flex flex-col space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/40 rounded-lg p-4">
            <p className="text-sm text-gray-400">Best Score</p>
            <p className="text-2xl font-bold text-yellow-500">{bestScore ? bestScore.score : 0}</p>
          </div>
          <div className="bg-gray-800/40 rounded-lg p-4">
            <p className="text-sm text-gray-400">Average Score</p>
            <p className="text-2xl font-bold text-blue-500">{averageScore}</p>
          </div>
          <div className="bg-gray-800/40 rounded-lg p-4">
            <p className="text-sm text-gray-400">Games Played</p>
            <p className="text-2xl font-bold text-green-500">{scores.length}</p>
          </div>
        </div>

        {/* Score History */}
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Games</h3>
          <div className="space-y-3">
            {scores.map((score, index) => (
              <ScoreCard key={`${score.timestamp}-${index}`} {...score} />
            ))}
          </div>
          {scores.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No games played yet. Start playing to see your score history!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center my-24 max-w-7xl mx-auto px-4 space-y-8">
      {/* Skins Grid section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Available Skins</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{/* ... Skins Grid content ... */}</div>
      </div>

      {/* Score History section */}
      <div className="w-full" id="score-history">
        <ScoreHistory />
      </div>
    </div>
  );
}
