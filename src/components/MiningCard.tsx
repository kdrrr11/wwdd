// src/components/MiningCard.tsx
import React, { useState, useEffect } from 'react';
import { Coin, MiningSession } from '../types';
import { Play, Square, TrendingUp, Zap } from 'lucide-react';
import { formatHashRate } from '../utils/miningCalculations';

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
  const [timeElapsed, setTimeElapsed] = useState('');

  useEffect(() => {
    if (!session?.isActive) {
      setProgress(0);
      setTimeElapsed('');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(session.startTime).getTime();
      const elapsed = (now - start) / 1000; // seconds
      
      // Progress cycles every 60 seconds for visual feedback
      const cycleProgress = (elapsed % 60) / 60 * 100;
      setProgress(cycleProgress);
      
      // Format elapsed time
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = Math.floor(elapsed % 60);
      
      if (hours > 0) {
        setTimeElapsed(`${hours}sa ${minutes}dk ${seconds}sn`);
      } else if (minutes > 0) {
        setTimeElapsed(`${minutes}dk ${seconds}sn`);
      } else {
        setTimeElapsed(`${seconds}sn`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const isActive = session?.isActive || false;
  const hashRate = session?.hashRate || coin.baseHashRate;
  const earnings = session?.totalEarned || 0;

  // CSS class name için animation
  const pulseAnimation = `
    @keyframes mining-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  `;

  return (
    <>
      {/* CSS animasyonu için style tag'i */}
      <style>{pulseAnimation}</style>
      
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700 hover:border-gray-600 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold"
              style={{ backgroundColor: `${coin.color}20`, color: coin.color }}
            >
              {coin.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-lg font-semibold text-white truncate">{coin.name}</h3>
              <p className="text-xs md:text-sm text-gray-400">{coin.symbol}</p>
            </div>
          </div>
          
          <button
            onClick={() => isActive && session ? onStop(session.id) : onStart(coin.id)}
            disabled={disabled || (isActive && !session)}
            className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all text-sm ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${(disabled || (isActive && !session)) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isActive ? (
              <>
                <Square className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Durdur</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Başlat</span>
              </>
            )}
          </button>
        </div>

        {/* Active Mining Display */}
        {isActive && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: coin.color 
                }}
              />
            </div>
            
            {/* Mining Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <p className="text-gray-400 text-xs">Hash Hızı</p>
                </div>
                <p className="text-white font-semibold text-xs md:text-sm">
                  {formatHashRate(hashRate)}
                </p>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <p className="text-gray-400 text-xs">Kazanç</p>
                </div>
                <p className="text-green-400 font-semibold text-xs md:text-sm">
                  ${earnings.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Time Elapsed */}
            {timeElapsed && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Madencilik Süresi</span>
                  <span className="text-white font-medium text-xs">{timeElapsed}</span>
                </div>
              </div>
            )}

            {/* Mining Animation */}
            <div className="flex items-center justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 md:w-2 md:h-2 rounded-full"
                  style={{ 
                    backgroundColor: coin.color,
                    animation: `mining-pulse 1.5s infinite ${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inactive Display */}
        {!isActive && session && earnings > 0 && (
          <div className="text-center py-6">
            <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Son Oturum Kazancı</span>
            </div>
            <p className="text-green-400 font-semibold text-lg">${earnings.toFixed(6)}</p>
          </div>
        )}

        {/* No Previous Session */}
        {!isActive && (!session || earnings === 0) && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
              <Play className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">{coin.symbol} kazanmak için madenciliği başlatın</p>
            <p className="text-gray-500 text-xs mt-1">Temel hız: {formatHashRate(coin.baseHashRate)}</p>
          </div>
        )}
      </div>
    </>
  );
};
