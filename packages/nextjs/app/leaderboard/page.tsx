"use client";

import { useState } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  wallet: string;
  nftAddress: string;
  score: number;
  birdType: string;
  timestamp: string;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "FlappyMaster",
    wallet: "0x1234...5678",
    nftAddress: "0x1234567890abcdef1234567890abcdef12345678",
    score: 156,
    birdType: "Golden Bird",
    timestamp: "2024-11-26T14:23:45.123Z",
  },
  {
    rank: 2,
    username: "CryptoFlapper",
    wallet: "0xabcd...efgh",
    nftAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    score: 142,
    birdType: "Phoenix Bird",
    timestamp: "2024-11-26T15:30:12.123Z",
  },
  {
    rank: 3,
    username: "Web3Bird",
    wallet: "0x9876...5432",
    nftAddress: "0x9876543210fedcba9876543210fedcba98765432",
    score: 138,
    birdType: "Shadow Bird",
    timestamp: "2024-11-26T16:45:22.123Z",
  },
];

const LeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-200";
    }
  };

  const getEtherscanLink = (address: string) => `https://etherscan.io/address/${address}`;

  return (
    <div className="bg-gray-800/40 rounded-lg overflow-hidden">
      <div
        className="flex items-center p-4 cursor-pointer hover:bg-gray-800/60 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Rank & Basic Info */}
        <div className={`text-2xl font-bold w-12 ${getRankColor(entry.rank)}`}>#{entry.rank}</div>

        <div className="flex-1 flex items-center gap-4">
          <div className="w-8 h-8 relative">
            <img
              src={`/img/${entry.birdType.toLowerCase().replace(" ", "-")}.png`}
              alt={entry.birdType}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium">{entry.username}</div>
            <div className="text-sm text-gray-400">{entry.birdType}</div>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-xl font-bold">{entry.score}</div>
          <div className="text-sm text-gray-400">points</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700/30">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Wallet: </span>
              <a
                href={getEtherscanLink(entry.wallet)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {entry.wallet}
              </a>
            </div>
            <div>
              <span className="text-gray-400">NFT Address: </span>
              <a
                href={getEtherscanLink(entry.nftAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {entry.nftAddress.slice(0, 6)}...{entry.nftAddress.slice(-4)}
              </a>
            </div>
            <div>
              <span className="text-gray-400">Achieved: </span>
              {new Date(entry.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Leaderboard() {
  return (
    <div className="w-full flex flex-col items-center my-24 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Global Leaderboard</h1>
      <p className="text-gray-400 mb-8">Top Flappy Bird Players Worldwide</p>

      {/* Time Period Filter - for future implementation */}
      <div className="w-full mb-6">
        <div className="flex gap-2 justify-center">
          <button className="px-4 py-2 rounded-lg bg-primary text-white">All Time</button>
          <button className="px-4 py-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/60">Monthly</button>
          <button className="px-4 py-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/60">Weekly</button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="w-full space-y-3">
        {MOCK_LEADERBOARD.map(entry => (
          <LeaderboardRow key={entry.nftAddress} entry={entry} />
        ))}
      </div>
    </div>
  );
}
