import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Calendar, DollarSign, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isTrialActive = user.trialEndDate && new Date() < new Date(user.trialEndDate) && user.totalTrialEarnings < 25;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account and view your mining statistics</p>
      </div>

      {/* User Information */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Calendar className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance and Earnings */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Balance & Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-white">${user.balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Trial Earnings</p>
              <p className="text-2xl font-bold text-white">${user.totalTrialEarnings.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <Package className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Package</p>
              <p className="text-xl font-bold text-white">{user.activePackage || 'Free Trial'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Status */}
      {!user.activePackage && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Trial Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-600/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Trial End Date</p>
                <p className="text-white font-medium">
                  {user.trialEndDate ? format(new Date(user.trialEndDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${isTrialActive ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                <Clock className={`h-6 w-6 ${isTrialActive ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className={`font-medium ${isTrialActive ? 'text-green-400' : 'text-red-400'}`}>
                  {isTrialActive ? 'Active' : 'Expired'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Trial Earnings Progress</span>
              <span>${user.totalTrialEarnings.toFixed(2)} / $25.00</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                style={{ width: `${Math.min((user.totalTrialEarnings / 25) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Account Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
            <Package className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium">View Packages</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-colors">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Request Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">Account Created</p>
                <p className="text-sm text-gray-400">Free trial activated</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {format(new Date(user.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};