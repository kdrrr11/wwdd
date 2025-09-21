import React, { useState, useEffect } from 'react';
import { Coin, MiningSession } from '../types';
import { Play, Square, TrendingUp } from 'lucide-react';

interface MiningCardProps {
  coin: Coin;
  session?: MiningSession;
  onStart: (coinId: string) => void;
  onStop: (sessionId: string) => void;
  disabled?: boolean;
}

export const MiningCard: React.FC<MiningCardProps> = ({
  coin,
  session,
  onStart,
  onStop,
  disabled = false
}) => {
  const [progress, setProgress] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!session?.isActive) {
      setProgress(0);
      setEarnings(session?.totalEarned || 0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(session.startTime).getTime();
      const elapsed = (now - start) / 1000; // seconds
      
      // Simulate progress (reset every 60 seconds)
      const cycleProgress = (elapsed % 60) / 60 * 100;
      setProgress(cycleProgress);
      
      // Calculate earnings (very small amounts for simulation)
      const hourlyEarning = coin.baseEarning * (session.hashRate / coin.baseHashRate);
      const newEarnings = (elapsed / 3600) * hourlyEarning;
      setEarnings(newEarnings);
    }, 100);

    return () => clearInterval(interval);
  }, [session, coin]);

  const isActive = session?.isActive || false;
  const hashRate = session?.hashRate || coin.baseHashRate;

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: `${coin.color}20`, color: coin.color }}
          >
            {coin.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{coin.name}</h3>
            <p className="text-sm text-gray-400">{coin.symbol}</p>
          </div>
        </div>
        
        <button
          onClick={() => isActive && session ? onStop(session.id) : onStart(coin.id)}
          disabled={disabled}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isActive ? (
            <>
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>

      {isActive && (
        <div className="space-y-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ 
                width: `${progress}%`,
                backgroundColor: coin.color 
              }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Hash Rate</p>
              <p className="text-white font-semibold">{hashRate.toLocaleString()} H/s</p>
            </div>
            <div>
              <p className="text-gray-400">Earnings</p>
              <p className="text-green-400 font-semibold">${earnings.toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}

      {!isActive && session && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>Last session: ${earnings.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
};