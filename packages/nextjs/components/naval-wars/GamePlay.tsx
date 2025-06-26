import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';

interface GamePlayProps {
  playerGrid: (string | null)[][];
  onGameEnd: (winner: 'player' | 'computer') => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ playerGrid, onGameEnd }) => {
  console.log('GamePlay component rendering with playerGrid:', playerGrid);
  
  const [playerShots, setPlayerShots] = useState<boolean[][]>(
    Array(10).fill(null).map(() => Array(10).fill(false))
  );
  const [computerShots, setComputerShots] = useState<boolean[][]>(
    Array(10).fill(null).map(() => Array(10).fill(false))
  );
  const [computerGrid, setComputerGrid] = useState<(string | null)[][]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'computer'>('player');
  const [gameStats, setGameStats] = useState({
    playerHits: 0,
    playerMisses: 0,
    computerHits: 0,
    computerMisses: 0
  });

  // Generate computer fleet
  useEffect(() => {
    console.log('Generating computer fleet...');
    const generateComputerFleet = () => {
      const grid: (string | null)[][] = Array(10).fill(null).map(() => Array(10).fill(null));
      const ships = [
        { id: 'comp-destroyer', length: 2 },
        { id: 'comp-cruiser1', length: 3 },
        { id: 'comp-submarine', length: 3 },
        { id: 'comp-battleship', length: 4 },
        { id: 'comp-carrier', length: 5 }
      ];

      const canPlace = (row: number, col: number, length: number, horizontal: boolean) => {
        if (horizontal && col + length > 10) return false;
        if (!horizontal && row + length > 10) return false;

        for (let i = 0; i < length; i++) {
          const checkRow = horizontal ? row : row + i;
          const checkCol = horizontal ? col + i : col;
          if (grid[checkRow][checkCol] !== null) return false;
        }
        return true;
      };

      ships.forEach(ship => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
          const row = Math.floor(Math.random() * 10);
          const col = Math.floor(Math.random() * 10);
          const horizontal = Math.random() > 0.5;
          
          if (canPlace(row, col, ship.length, horizontal)) {
            for (let i = 0; i < ship.length; i++) {
              const placeRow = horizontal ? row : row + i;
              const placeCol = horizontal ? col + i : col;
              grid[placeRow][placeCol] = ship.id;
            }
            placed = true;
          }
          attempts++;
        }
      });

      return grid;
    };

    const generatedGrid = generateComputerFleet();
    console.log('Computer fleet generated:', generatedGrid);
    setComputerGrid(generatedGrid);
  }, []);

  const makePlayerShot = (row: number, col: number) => {
    if (currentTurn !== 'player' || playerShots[row][col] || computerGrid.length === 0) return;

    const newShots = playerShots.map(r => [...r]);
    newShots[row][col] = true;
    setPlayerShots(newShots);

    const isHit = computerGrid[row][col] !== null;
    setGameStats(prev => ({
      ...prev,
      playerHits: prev.playerHits + (isHit ? 1 : 0),
      playerMisses: prev.playerMisses + (isHit ? 0 : 1)
    }));

    setCurrentTurn('computer');
    checkWinCondition('player', newShots, computerGrid);
  };

  const makeComputerShot = () => {
    if (currentTurn !== 'computer') return;

    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (computerShots[row][col]);

    const newShots = computerShots.map(r => [...r]);
    newShots[row][col] = true;
    setComputerShots(newShots);

    const isHit = playerGrid[row][col] !== null;
    setGameStats(prev => ({
      ...prev,
      computerHits: prev.computerHits + (isHit ? 1 : 0),
      computerMisses: prev.computerMisses + (isHit ? 0 : 1)
    }));

    setCurrentTurn('player');
    checkWinCondition('computer', newShots, playerGrid);
  };

  const checkWinCondition = (attacker: 'player' | 'computer', shots: boolean[][], targetGrid: (string | null)[][]) => {
    let allShipsSunk = true;
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (targetGrid[row][col] !== null && !shots[row][col]) {
          allShipsSunk = false;
          break;
        }
      }
      if (!allShipsSunk) break;
    }

    if (allShipsSunk) {
      console.log('Game ended, winner:', attacker);
      setTimeout(() => onGameEnd(attacker), 1000);
    }
  };

  useEffect(() => {
    if (currentTurn === 'computer' && computerGrid.length > 0) {
      const timer = setTimeout(makeComputerShot, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, computerGrid]);

  // Show loading state if computer grid is not ready
  if (computerGrid.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Preparing battle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl  mx-auto">
        <div className="text-center bg-slate-800 p-6 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-2">⚔️ Naval Combat</h1>
          <p className="text-blue-300">
            Current Turn: <span className="font-bold text-green-400">
              {currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
            </span>
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">{gameStats.playerHits}</p>
              <p className="text-slate-300 text-sm">Your Hits</p>
            </div>
          </div>
          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body p-4 text-center">
              <p className="text-blue-400 text-2xl font-bold">{gameStats.playerMisses}</p>
              <p className="text-slate-300 text-sm">Your Misses</p>
            </div>
          </div>
          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body p-4 text-center">
              <p className="text-red-400 text-2xl font-bold">{gameStats.computerHits}</p>
              <p className="text-slate-300 text-sm">Enemy Hits</p>
            </div>
          </div>
          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body p-4 text-center">
              <p className="text-slate-400 text-2xl font-bold">{gameStats.computerMisses}</p>
              <p className="text-slate-300 text-sm">Enemy Misses</p>
            </div>
          </div>
        </div>

        {/* Game Boards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body">
              <h2 className="card-title text-white text-center">🎯 Enemy Waters</h2>
              <div className="flex justify-center">
                <GameBoard 
                  grid={computerGrid}
                  shots={playerShots}
                  onCellClick={currentTurn === 'player' ? makePlayerShot : undefined}
                />
              </div>
            </div>
          </div>

          <div className="card bg-slate-800 border-slate-600">
            <div className="card-body">
              <h2 className="card-title text-white text-center">🛡️ Your Fleet</h2>
              <div className="flex justify-center">
                <GameBoard 
                  grid={playerGrid}
                  shots={computerShots}
                  isPlayerBoard={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;