import React from 'react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

interface GameResultProps {
  winner: 'player' | 'computer';
  onPlayAgain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ winner, onPlayAgain }) => {
  const { sendAsync } = useScaffoldWriteContract({
    contractName: "BattleContract",
    functionName: "withdraw_loot",
    args: [],
  });

  const handleClaimLoot = async () => {
    try {
      await sendAsync();
      onPlayAgain(); // Optionally reset game after claiming loot
    } catch (error) {
      // Optionally show error notification
      console.error("Withdraw loot failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md bg-slate-800 border-slate-600">
        <div className="card-body items-center text-center">
          <div className="text-6xl mb-4">
            {winner === 'player' ? '🏆' : '💀'}
          </div>
          <h2 className={`card-title text-3xl font-bold ${winner === 'player' ? 'text-green-400' : 'text-red-400'}`}>
            {winner === 'player' ? 'Victory!' : 'Defeat!'}
          </h2>
          <p className="text-white text-lg mt-4">
            {winner === 'player' 
              ? 'Congratulations, Admiral! Your tactical prowess has secured victory over the enemy fleet.' 
              : 'The enemy has outmaneuvered your fleet. Better luck next time, Admiral.'
            }
          </p>
          {winner === 'player' ? (
            <button 
              onClick={handleClaimLoot}
              className="btn btn-success w-full mt-6 font-bold py-3"
            >
              Claim Loot
            </button>
          ) : (
            <button 
              onClick={onPlayAgain}
              className="btn btn-primary w-full mt-6 font-bold py-3"
            >
              Play Again
            </button>
          )}
          <div className="text-slate-400 text-sm mt-3">
            {winner === 'player' ? 'Prize Pool: 200 Strk' : 'Better luck next battle!'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;