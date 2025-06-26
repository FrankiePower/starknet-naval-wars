import React from 'react';

function joinClassNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface GameBoardProps {
  grid: (string | null)[][];
  onCellClick?: (row: number, col: number) => void;
  isPlayerBoard?: boolean;
  shots?: boolean[][];
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  grid, 
  onCellClick, 
  isPlayerBoard = false, 
  shots = [],
  className 
}) => {
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  const getCellContent = (row: number, col: number) => {
    const hasShip = grid[row][col] !== null;
    const wasShot = shots[row] && shots[row][col];
    
    if (wasShot && hasShip) {
      return '💥'; // Hit
    } else if (wasShot) {
      return '💧'; // Miss
    } else if (isPlayerBoard && hasShip) {
      return '🚢'; // Ship on player's board
    }
    return '';
  };

  const getCellStyle = (row: number, col: number) => {
    const hasShip = grid[row][col] !== null;
    const wasShot = shots[row] && shots[row][col];
    
    if (wasShot && hasShip) {
      return 'bg-red-600 border-red-400'; // Hit
    } else if (wasShot) {
      return 'bg-blue-300 border-blue-200'; // Miss
    } else if (isPlayerBoard && hasShip) {
      return 'bg-green-600 border-green-400'; // Ship
    }
    return 'bg-slate-700 border-slate-600 hover:bg-slate-600';
  };

  return (
    <div className={joinClassNames("inline-block", className)}>
      <div className="grid grid-cols-11 gap-1 p-4 bg-slate-800 rounded-lg border border-slate-600">
        {/* Header row */}
        <div className="w-8 h-8"></div>
        {columns.map((col) => (
          <div key={col} className="w-8 h-8 flex items-center justify-center text-green-400 font-bold text-sm">
            {col}
          </div>
        ))}
        
        {/* Grid rows */}
        {Array.from({ length: 10 }, (_, row) => (
          <React.Fragment key={row}>
            {/* Row number */}
            <div className="w-8 h-8 flex items-center justify-center text-green-400 font-bold text-sm">
              {row + 1}
            </div>
            
            {/* Grid cells */}
            {Array.from({ length: 10 }, (_, col) => (
              <button
                key={`${row}-${col}`}
                className={joinClassNames(
                  "w-8 h-8 border-2 transition-all duration-200 flex items-center justify-center text-xs font-bold",
                  getCellStyle(row, col),
                  onCellClick && "cursor-pointer hover:scale-105"
                )}
                onClick={() => onCellClick?.(row, col)}
                disabled={shots[row] && shots[row][col]}
              >
                {getCellContent(row, col)}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;