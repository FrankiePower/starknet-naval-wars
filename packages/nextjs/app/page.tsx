"use client";
import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShipPlacement from '../components/naval-wars/ShipPlacement';
// import GamePlay from '@/components/GamePlay';
// import GameResult from '@/components/GameResult';

type GameState = 'menu' | 'placement' | 'playing' | 'result';

const Home = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [playerGrid, setPlayerGrid] = useState<(string | null)[][]>([]);
  const [winner, setWinner] = useState<'player' | 'computer'>('player');

  const startGame = () => {
    setGameState('placement');
  };

  const handlePlacementComplete = (grid: (string | null)[][]) => {
    setPlayerGrid(grid);
    setGameState('playing');
  };

  const handleGameEnd = (gameWinner: 'player' | 'computer') => {
    setWinner(gameWinner);
    setGameState('result');
  };

  const playAgain = () => {
    setGameState('placement');
    setPlayerGrid([]);
  };

  if (gameState === 'placement') {
    return <ShipPlacement onPlacementComplete={handlePlacementComplete} />;
  }

  // if (gameState === 'playing') {
  //   return <GamePlay playerGrid={playerGrid} onGameEnd={handleGameEnd} />;
  // }

  // if (gameState === 'result') {
  //   return <GameResult winner={winner} onPlayAgain={playAgain} />;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-accent dark:bg-base-200 transition-colors duration-500">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8 text-center flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/skull.svg"
              alt="Naval Wars Skull Logo"
              width={48}
              height={48}
              className="mb-4"
            />
            <h1 className="text-5xl md:text-5xl font-extrabold mb-4 bg-black bg-clip-text text-transparent dark:from-black dark:via-blue-300 dark:to-green-200">
              Naval Wars
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-black dark:text-black-300 mb-3 font-medium tracking-wide">
            Strategic naval warfare on the high seas
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12 w-full items-stretch justify-center">
          <div className="flex flex-col gap-8 w-full md:w-1/2">
            {/* Game Objective */}
            <div className="rounded-2xl shadow-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/90 p-6 backdrop-blur-md flex-1 flex flex-col justify-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl">🎯</span>
                <span className="font-bold text-blue-900 dark:text-white text-xl ml-2">Game Objective</span>
              </div>
              <ul className="text-blue-800 dark:text-slate-300 space-y-2 list-disc list-inside text-left">
                <li>Sink all enemy ships before they sink yours</li>
                <li>Strategic placement is key to victory</li>
                <li>Use tactical thinking to outmaneuver your opponent</li>
                <li className="font-semibold text-green-700 dark:text-green-400">Winner takes the prize pool of 200 Strk</li>
              </ul>
            </div>
            {/* Fleet Composition */}
            <div className="rounded-2xl shadow-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/90 p-6 backdrop-blur-md flex-1 flex flex-col justify-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl">🚢</span>
                <span className="font-bold text-blue-900 dark:text-white text-xl ml-2">Fleet Composition</span>
              </div>
              <ul className="text-blue-800 dark:text-slate-300 space-y-2 list-disc list-inside text-left">
                <li>1x Aircraft Carrier (5 units)</li>
                <li>1x Battleship (4 units)</li>
                <li>1x Cruiser (3 units)</li>
                <li>1x Submarine (3 units)</li>
                <li>1x Destroyer (2 units)</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-8 w-full md:w-1/2 justify-between">
            {/* Rules of Engagement */}
            <div className="rounded-2xl shadow-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/90 p-6 backdrop-blur-md flex-1 flex flex-col justify-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl">📜</span>
                <span className="font-bold text-blue-900 dark:text-white text-xl ml-2">Rules of Engagement</span>
              </div>
              <div className="text-blue-800 dark:text-slate-300 text-left space-y-4">
                <div>
                  <h4 className="text-green-700 dark:text-green-400 font-semibold">Board Setup:</h4>
                  <ul className="list-disc list-inside ml-4">
                    <li>10x10 grid with columns A-J and rows 1-10</li>
                    <li>Ships cannot overlap or be placed diagonally</li>
                    <li>Each player contributes 100 Strk to the prize pool</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-700 dark:text-green-400 font-semibold">Gameplay:</h4>
                  <ul className="list-disc list-inside ml-4">
                    <li>Take turns guessing opponent&apos;s ship coordinates</li>
                    <li>Hits are marked with <span className="font-bold">💥</span>, misses with <span className="font-bold">💧</span></li>
                    <li>A ship is sunk when all coordinates are hit</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-700 dark:text-green-400 font-semibold">Victory:</h4>
                  <ul className="list-disc list-inside ml-4">
                    <li>First to sink all enemy ships wins</li>
                    <li>Winner receives the full prize pool</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Enter Battle */}
            <div
              onClick={startGame}
              role="button"
              tabIndex={0}
              className="rounded-2xl shadow-xl border border-green-400 dark:border-green-500 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900 dark:via-green-800 dark:to-green-700 p-6 backdrop-blur-md flex flex-col items-center justify-center gap-4 flex-1 cursor-pointer select-none transition-transform hover:scale-105 focus:scale-105 active:scale-100 outline-none focus:ring-2 focus:ring-green-400"
              style={{ minHeight: '120px' }}
            >
              <Link href="/battle" className="w-full h-full flex flex-col items-center justify-center gap-4 flex-1 cursor-pointer select-none transition-transform hover:scale-105 focus:scale-105 active:scale-100 outline-none focus:ring-2 focus:ring-green-400 rounded-2xl shadow-xl border border-green-400 dark:border-green-500 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900 dark:via-green-800 dark:to-green-700 p-6 backdrop-blur-md" style={{ minHeight: '120px' }}>
                <div className="flex items-center gap-2">
                  <Image src="/skull.svg" alt="Skull Logo" width={32} height={32} />
                  <span className="text-2xl font-bold text-green-800 dark:text-green-200">Enter Battle</span>
                </div>
              </Link>
            </div>
            <p className="text-green-800 dark:text-black-300 text-sm font-medium text-center">
              Free Strk tokens available for testing • Powered by Starknet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
