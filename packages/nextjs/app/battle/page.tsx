"use client";
import React, { useState } from "react";
import ShipPlacement from "../../components/naval-wars/ShipPlacement";
import Link from "next/link";
import Image from "next/image";
// import GamePlay from "../../components/GamePlay";
// import GameResult from "../../components/GameResult";

type GameState = "placement" | "playing" | "result";

const BattlePage = () => {
  const [gameState, setGameState] = useState<GameState>("placement");
  const [playerGrid, setPlayerGrid] = useState<(string | null)[][]>([]);
  const [winner, setWinner] = useState<"player" | "computer">("player");

  const handlePlacementComplete = (grid: (string | null)[][]) => {
    setPlayerGrid(grid);
    setGameState("playing");
  };

  const handleGameEnd = (gameWinner: "player" | "computer") => {
    setWinner(gameWinner);
    setGameState("result");
  };

  const playAgain = () => {
    setGameState("placement");
    setPlayerGrid([]);
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {gameState === "placement" && (
          <ShipPlacement onPlacementComplete={handlePlacementComplete} />
        )}
        {/* {gameState === "playing" && (
          <GamePlay playerGrid={playerGrid} onGameEnd={handleGameEnd} />
        )}
        {gameState === "result" && (
          <GameResult winner={winner} onPlayAgain={playAgain} />
        )} */}
      </div>
    </div>
  );
};

export default BattlePage;
