"use client";

import React, { useEffect, useState } from "react";
import Bird from "./Bird";
import Pipes from "./Pipes";
import { constants } from "./store";

// GameBox.jsx
export default function GameBox() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [birdPosition, setBirdPosition] = useState(constants.DEFAULT_BIRD_Y);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gravity = setInterval(() => {
      setBirdPosition(prev => {
        if (prev >= constants.WINDOW_HEIGHT - constants.BIRD_SIZE - 20) {
          setGameOver(true);
          return constants.WINDOW_HEIGHT - constants.BIRD_SIZE - 20; // Stop at bottom
        }
        return prev + constants.GRAVITY;
      });
    }, 24);

    return () => clearInterval(gravity);
  }, [gameStarted, gameOver]);

  const handleJump = () => {
    if (!gameStarted || gameOver) {
      if (gameOver) {
        setBirdPosition(constants.DEFAULT_BIRD_Y);
        setScore(0);
        setGameOver(false);
      }
      setGameStarted(true);
      return;
    }
    setBirdPosition(prev => Math.max(0, prev - 80));
  };

  const handleCollision = () => {
    setGameOver(true);
  };

  return (
    <div
      onClick={handleJump}
      onKeyDown={e => e.code === "Space" && handleJump()}
      className="relative max-w-5xl h-[600px] w-[288px] lg:w-[800px] mx-auto overflow-hidden select-none bg-cover bg-repeat-x"
      style={{
        backgroundImage: 'url("/img/background-day.png")',
        backgroundSize: "288px 600px",
      }}
      tabIndex={0}
    >
      <div className="absolute top-4 right-4 z-10 text-4xl text-white font-bold">{score}</div>
      <Bird position={birdPosition} gameStarted={gameStarted} gameOver={gameOver} />
      {gameStarted && !gameOver && (
        <Pipes
          onScore={() => setScore(s => s + 1)}
          onCollision={handleCollision}
          birdPosition={birdPosition}
          gameStarted={gameStarted}
        />
      )}

      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[200px] h-[200px] bg-center bg-contain bg-no-repeat bg-[url('/img/gamestart.png')]" />
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[200px] h-[200px] bg-center bg-contain bg-no-repeat bg-[url('/img/gameover.png')]" />
        </div>
      )}
    </div>
  );
}
