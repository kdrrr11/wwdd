import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { TrialStatus } from '../components/TrialStatus';
import { TrendingUp, DollarSign, Clock, Package } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Balance',
      value: `$${user?.balance.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      label: 'Trial Earnings',
      value: `$${user?.totalTrialEarnings.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      label: 'Active Package',
      value: user?.activePackage || 'Free Trial',
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.email}</p>
      </div>

      <TrialStatus />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">Mining Session Started</p>
                <p className="text-sm text-gray-400">Bitcoin mining activated</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">2 hours ago</p>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div>
                <p className="text-white font-medium">Account Created</p>
                <p className="text-sm text-gray-400">Free trial activated</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">1 day ago</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <div className="text-left">
              <p className="text-white font-medium">Start Mining</p>
              <p className="text-sm text-gray-400">Begin earning crypto</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 rounded-lg bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition-colors">
            <Package className="h-5 w-5 text-purple-400" />
            <div className="text-left">
              <p className="text-white font-medium">Upgrade Plan</p>
              <p className="text-sm text-gray-400">Get premium features</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};