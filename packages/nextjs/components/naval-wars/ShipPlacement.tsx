import React, { useState } from 'react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import 'daisyui';
import GameBoard from '../naval-wars/GameBoard';

interface Ship {
  id: string;
  name: string;
  length: number;
  placed: boolean;
}

interface ShipPlacementProps {
  onPlacementComplete: (grid: (string | null)[][]) => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({ onPlacementComplete }) => {
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(10).fill(null).map(() => Array(10).fill(null))
  );
  
  const [ships] = useState<Ship[]>([
    { id: 'destroyer', name: 'Destroyer', length: 2, placed: false },
    { id: 'cruiser1', name: 'Cruiser', length: 3, placed: false },
    { id: 'submarine', name: 'Submarine', length: 3, placed: false },
    { id: 'battleship', name: 'Battleship', length: 4, placed: false },
    { id: 'carrier', name: 'Aircraft Carrier', length: 5, placed: false }
  ]);

  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [placedShips, setPlacedShips] = useState<Set<string>>(new Set());

  const canPlaceShip = (row: number, col: number, ship: Ship, horizontal: boolean): boolean => {
    // Check if ship fits within bounds
    if (horizontal && col + ship.length > 10) return false;
    if (!horizontal && row + ship.length > 10) return false;

    // Check for overlapping ships
    for (let i = 0; i < ship.length; i++) {
      const checkRow = horizontal ? row : row + i;
      const checkCol = horizontal ? col + i : col;
      if (grid[checkRow][checkCol] !== null) return false;
    }

    return true;
  };

  const placeShip = (row: number, col: number) => {
    if (!selectedShip || !canPlaceShip(row, col, selectedShip, isHorizontal)) return;

    const newGrid = grid.map(row => [...row]);
    
    for (let i = 0; i < selectedShip.length; i++) {
      const placeRow = isHorizontal ? row : row + i;
      const placeCol = isHorizontal ? col + i : col;
      newGrid[placeRow][placeCol] = selectedShip.id;
    }

    setGrid(newGrid);
    setPlacedShips(new Set([...placedShips, selectedShip.id]));
    setSelectedShip(null);
  };

  const clearShip = (shipId: string) => {
    const newGrid = grid.map(row => 
      row.map(cell => cell === shipId ? null : cell)
    );
    setGrid(newGrid);
    setPlacedShips(new Set([...placedShips].filter(id => id !== shipId)));
  };

  const allShipsPlaced = placedShips.size === ships.length;

  const { sendAsync } = useScaffoldWriteContract({
    contractName: "BattleContract",
    functionName: "fight_battle",
    args: [10000],
  });

const { sendAsync: approveAsync } = useScaffoldWriteContract({
    contractName: "DefenceToken",
    functionName: "approve",
    args: ["0x7fa43cd7bcf5cc2499cad8378d4081c1f1a4465f57ca02beaacda9639825804", 10000],
});

  const handleFightBattle = async () => {
    try {

        // First, approve the BattleContract to spend DefenceToken
        const approveResult = await approveAsync();
        console.log("approve transaction successful:", approveResult);
      const result = await sendAsync();
      console.log("fight_battle transaction successful:", result);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2"> Fleet Deployment</h1>
          <p className=" text-blue-300">Position your naval fleet strategically</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsHorizontal(!isHorizontal)}
                className="btn btn-outline btn-primary bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Direction: {isHorizontal ? 'Horizontal →' : 'Vertical ↓'}
              </button>
            </div>
            <GameBoard 
              grid={grid} 
              onCellClick={selectedShip ? placeShip : undefined}
              isPlayerBoard={true}
            />
          </div>

          {/* Ship Selection */}
          <div className="space-y-4">
            <div className="card bg-slate-800 border-slate-600">
              <div className="card-body">
                <h2 className="card-title text-white">🚢 Fleet Status</h2>
                <div className="space-y-3">
                  {ships.map((ship) => {
                    const isPlaced = placedShips.has(ship.id);
                    const isSelected = selectedShip?.id === ship.id;
                    return (
                      <div 
                        key={ship.id}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          isPlaced 
                            ? 'bg-green-800 border-green-600' 
                            : isSelected 
                              ? 'bg-blue-800 border-blue-600' 
                              : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-white font-semibold">{ship.name}</h3>
                            <p className="text-slate-300 text-sm">Length: {ship.length}</p>
                          </div>
                          <div className="space-x-2">
                            {isPlaced ? (
                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() => clearShip(ship.id)}
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setSelectedShip(isSelected ? null : ship)}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {allShipsPlaced && (
              <button 
                type="button"
                className="btn btn-success w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                onClick={async () => {
                  await onPlacementComplete(grid);
                  await handleFightBattle();
                }}
              >
                Battle!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacement;