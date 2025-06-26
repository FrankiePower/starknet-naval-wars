import React from 'react';

interface GameResultProps {
  winner: 'player' | 'computer';
  onPlayAgain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ winner, onPlayAgain }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
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
          <button 
            onClick={onPlayAgain}
            className="btn btn-primary w-full mt-6 font-bold py-3"
          >
            ⚓ New Campaign
          </button>
          <div className="text-slate-400 text-sm mt-3">
            {winner === 'player' ? 'Prize Pool: 200 tBTC' : 'Better luck next battle!'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;