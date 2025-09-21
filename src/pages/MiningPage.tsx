// src/pages/MiningPage.tsx
import React from 'react';
import { useMining } from '../hooks/useMining';
import { useAuth } from '../hooks/useAuth';
import { MiningCard } from '../components/MiningCard';
import { AlertCircle, Zap, Clock, Package as PackageIcon } from 'lucide-react';

export const MiningPage: React.FC = () => {
  const { user } = useAuth();
  const { coins, activeSessions, isLoading, startMining, stopMining, canMine } = useMining();
  
  const activeSession = activeSessions[0]; // Only one session can be active at a time
  const activeCoin = coins.find(c => c.id === activeSession?.coin);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Mining</h1>
        <p className="text-gray-400 text-sm md:text-base">Start mining cryptocurrencies and earn rewards</p>
      </div>

      {/* Mining Unavailable Warning */}
      {!canMine && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4 md:p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-red-400 font-semibold text-sm md:text-base">Mining Unavailable</h3>
              <p className="text-gray-300 text-sm mt-1">
                {user?.totalTrialEarnings && user.totalTrialEarnings >= 25
                  ? 'Trial earnings limit ($25) reached. Purchase a package to continue mining.'
                  : 'Trial period expired. Purchase a package to continue mining.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Mining Status */}
      {activeSession && activeCoin && (
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-600/20">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-green-400 font-semibold text-sm md:text-base">Mining Active</h3>
              <p className="text-gray-300 text-sm">
                Currently mining {activeCoin.name} ({activeCoin.symbol})
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-green-400"
                  style={{
                    animation: `pulse 1.5s infinite ${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats for Active Mining */}
      {activeSession && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 border border-gray-700">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
              <p className="text-gray-400 text-xs">Hash Rate</p>
            </div>
            <p className="text-white font-bold text-sm md:text-base">
              {(activeSession.hashRate / 1000).toFixed(1)}KH/s
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 border border-gray-700">
            <div className="flex items-center space-x-2 mb-1">
              <PackageIcon className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
              <p className="text-gray-400 text-xs">Package</p>
            </div>
            <p className="text-white font-bold text-sm md:text-base">
              {user?.activePackage || 'Trial'}
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 border border-gray-700">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
              <p className="text-gray-400 text-xs">Session</p>
            </div>
            <p className="text-white font-bold text-sm md:text-base">Active</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 border border-gray-700">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-400"></div>
              <p className="text-gray-400 text-xs">Earnings</p>
            </div>
            <p className="text-green-400 font-bold text-sm md:text-base">
              ${activeSession.totalEarned.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      {/* Coins Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {coins.map((coin) => {
          const session = activeSessions.find(s => s.coin === coin.id);
          const isOtherCoinActive = activeSession && activeSession.coin !== coin.id;
          
          return (
            <MiningCard
              key={coin.id}
              coin={coin}
              session={session}
              onStart={startMining}
              onStop={stopMining}
              disabled={!canMine || isLoading || isOtherCoinActive}
            />
          );
        })}
      </div>

      {/* Mining Rules */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Mining Rules & Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm md:text-base">Basic Rules</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                <span>Only one coin can be mined at a time</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                <span>Free trial allows up to $25 USDT total earnings</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                <span>Earnings are automatically added to your balance</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm md:text-base">Premium Benefits</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <span>Premium packages offer 2x-5x higher hash rates</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <span>No earning limits with paid packages</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <span>Priority support and faster processing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};