import React from 'react';
import { useMining } from '../hooks/useMining';
import { useAuth } from '../hooks/useAuth';
import { MiningCard } from '../components/MiningCard';
import { AlertCircle } from 'lucide-react';

export const MiningPage: React.FC = () => {
  const { user } = useAuth();
  const { coins, activeSessions, isLoading, startMining, stopMining } = useMining();
  
  // Check if user can mine (trial active or has package)
  const canMine = user && (
    (user.trialEndDate && new Date() < new Date(user.trialEndDate) && user.totalTrialEarnings < 25) ||
    user.activePackage
  );

  const activeSession = activeSessions[0]; // Since only one can be active at a time

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mining</h1>
        <p className="text-gray-400">Start mining cryptocurrencies and earn rewards</p>
      </div>

      {!canMine && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Mining Unavailable</h3>
              <p className="text-gray-300">
                {user?.totalTrialEarnings && user.totalTrialEarnings >= 25
                  ? 'Trial earnings limit reached. Purchase a package to continue mining.'
                  : 'Trial period expired. Purchase a package to continue mining.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mining Status */}
      {activeSession && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-green-400 font-semibold mb-2">Mining Active</h3>
          <p className="text-gray-300">
            Currently mining {coins.find(c => c.id === activeSession.coin)?.name}
          </p>
        </div>
      )}

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Mining Rules</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Only one coin can be mined at a time</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Free trial allows up to $25 USDT total earnings</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Premium packages offer higher hash rates</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Earnings are automatically added to your balance</span>
          </li>
        </ul>
      </div>
    </div>
  );
};