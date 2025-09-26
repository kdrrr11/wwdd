// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { TrialStatus } from '../components/TrialStatus';
import { ReferralSystem } from '../components/ReferralSystem';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TrendingUp, DollarSign, Clock, Package, Pickaxe, Eye, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const stats = [
    {
      label: 'Toplam Bakiye',
      value: `$${(user?.balance ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      change: '+0.00%',
      changeColor: 'text-green-400',
      label: t('totalBalance')
    },
    {
      label: t('trialEarnings'),
      value: `$${(user?.totalTrialEarnings ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      change: `${user?.totalTrialEarnings ? '+' + (((user.totalTrialEarnings ?? 0) / 25) * 100).toFixed(1) + '%' : '0%'}`,
      changeColor: 'text-blue-400'
    },
    {
      label: t('activePackage'),
      value: user?.activePackage || t('freeTrial'),
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      change: user?.activePackage ? 'Premium' : 'Deneme',
      changeColor: user?.activePackage ? 'text-purple-400' : 'text-gray-400'
    }
  ];

  const quickActions = [
    {
      title: t('startMining'),
      description: t('startMining'),
      icon: Pickaxe,
      color: 'bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30',
      iconColor: 'text-blue-400',
      link: '/mining'
    },
    {
      title: t('packages'),
      description: t('packages'),
      icon: Package,
      color: 'bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/30',
      iconColor: 'text-purple-400',
      link: '/packages'
    },
    {
      title: t('earnings'),
      description: t('earnings'),
      icon: TrendingUp,
      color: 'bg-green-600/20 border-green-500/30 hover:bg-green-600/30',
      iconColor: 'text-green-400',
      link: '/profile'
    },
    {
      title: t('withdrawal'),
      description: t('withdrawal'),
      icon: DollarSign,
      color: 'bg-yellow-600/20 border-yellow-500/30 hover:bg-yellow-600/30',
      iconColor: 'text-yellow-400',
      link: '/withdrawal'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('dashboard')}</h1>
          {user?.isAdmin && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 px-3 py-1 rounded-full">
              <Shield className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Yönetici</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm md:text-base">
          {t('welcomeBack')}, {user?.email}
          {user?.isAdmin && <span className="text-red-400 ml-2">(Admin)</span>}
        </p>
      </div>

      {/* Trial Status */}
      {!user?.isAdmin && <TrialStatus />}

      {/* Referral System */}
      {!user?.isAdmin && <ReferralSystem />}

      {/* Admin Quick Access */}
      {user?.isAdmin && (
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-4 md:p-6 border border-red-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-red-600/20">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-white">Yönetici Paneli</h3>
              <p className="text-sm text-gray-300">Sistem yönetimi ve kullanıcı işlemleri</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link
              to="/admin"
              className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-red-500/30 bg-red-600/10 hover:bg-red-600/20 transition-colors"
            >
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-red-400 mb-2 md:mb-3" />
              <div className="text-center">
                <p className="text-white font-medium text-xs md:text-sm mb-1">Admin Panel</p>
                <p className="text-gray-400 text-xs hidden md:block">Yönetim</p>
              </div>
            </Link>
            
            <Link
              to="/admin"
              className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-orange-500/30 bg-orange-600/10 hover:bg-orange-600/20 transition-colors"
            >
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-orange-400 mb-2 md:mb-3" />
              <div className="text-center">
                <p className="text-white font-medium text-xs md:text-sm mb-1">Ödemeler</p>
                <p className="text-gray-400 text-xs hidden md:block">Onay</p>
              </div>
            </Link>
            
            <Link
              to="/admin"
              className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-yellow-500/30 bg-yellow-600/10 hover:bg-yellow-600/20 transition-colors"
            >
              <Package className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 mb-2 md:mb-3" />
              <div className="text-center">
                <p className="text-white font-medium text-xs md:text-sm mb-1">Kullanıcılar</p>
                <p className="text-gray-400 text-xs hidden md:block">Yönetim</p>
              </div>
            </Link>
            
            <Link
              to="/admin"
              className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-green-500/30 bg-green-600/10 hover:bg-green-600/20 transition-colors"
            >
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-400 mb-2 md:mb-3" />
              <div className="text-center">
                <p className="text-white font-medium text-xs md:text-sm mb-1">İstatistikler</p>
                <p className="text-gray-400 text-xs hidden md:block">Analiz</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
                <div className={`text-xs font-medium ${stat.changeColor}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-white truncate">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickActions.filter(action => {
            // Admin için mining ve packages gizle
            if (user?.isAdmin && (action.link === '/mining' || action.link === '/packages')) {
              return false;
            }
            return true;
          }).map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`flex flex-col items-center p-3 md:p-4 rounded-lg border transition-colors ${action.color}`}
              >
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${action.iconColor} mb-2 md:mb-3`} />
                <div className="text-center">
                  <p className="text-white font-medium text-xs md:text-sm mb-1">{action.title}</p>
                  <p className="text-gray-400 text-xs hidden md:block">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-white">{t('recentActivity')}</h3>
          <Link to="/profile" className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
            <span>Tümünü Gör</span>
            <Eye className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm md:text-base">Hesap Oluşturuldu</p>
                <p className="text-gray-400 text-xs md:text-sm">Ücretsiz deneme etkinleştirildi</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bugün'}
            </p>
          </div>
          
          {user?.activePackage && (
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm md:text-base">Paket Etkinleştirildi</p>
                  <p className="text-gray-400 text-xs md:text-sm">{user.activePackage} paketi</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm">
                {user.packageActivatedAt ? new Date(user.packageActivatedAt).toLocaleDateString('tr-TR') : 'Yakın zamanda'}
              </p>
            </div>
          )}
          
          {user?.balance > 0 && (
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm md:text-base">Madencilik Kazancı</p>
                  <p className="text-gray-400 text-xs md:text-sm">Bakiye güncellendi</p>
                </div>
              </div>
              <p className="text-green-400 font-medium text-xs md:text-sm">
                +${(user.balance ?? 0).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mining Status Card */}
      {!user?.activePackage && !user?.isAdmin && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 md:p-3 rounded-lg bg-blue-600/20">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base">Deneme Aktif</h3>
                <p className="text-gray-300 text-xs md:text-sm">
                  ${(25 - (user?.totalTrialEarnings ?? 0)).toFixed(2)} kaldı
                </p>
              </div>
            </div>
            <Link
              to="/packages"
              className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs md:text-sm transition-colors"
            >
              Yükselt
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade Prompt */}
      {!user?.isAdmin && <UpgradePrompt />}
    </div>
  );
};
