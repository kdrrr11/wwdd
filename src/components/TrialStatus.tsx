import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const TrialStatus: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.activePackage) return null;

  const trialEndDate = new Date(user.trialEndDate || '');
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const earningsLeft = Math.max(0, 25 - user.totalTrialEarnings);
  const isTrialActive = daysLeft > 0 && earningsLeft > 0;

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Free Trial Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600/20">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Days Remaining</p>
            <p className="text-lg font-semibold text-white">{daysLeft} days</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-green-600/20">
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Earnings Limit</p>
            <p className="text-lg font-semibold text-white">
              ${earningsLeft.toFixed(2)} / $25.00
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Trial Progress</span>
          <span>{((user.totalTrialEarnings / 25) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
            style={{ width: `${Math.min((user.totalTrialEarnings / 25) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {!isTrialActive && (
        <div className="mt-4 p-3 rounded-lg bg-red-600/20 border border-red-500/30">
          <p className="text-red-400 text-sm">
            {daysLeft === 0 ? 'Trial period expired' : 'Trial earnings limit reached'}
          </p>
        </div>
      )}
    </div>
  );
};