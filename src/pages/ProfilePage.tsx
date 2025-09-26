import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';
import { User, Calendar, DollarSign, Package, Clock, Globe, Settings } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const isTrialActive = user.trialEndDate && isValidDate(user.trialEndDate) && new Date() < new Date(user.trialEndDate) && (user.totalTrialEarnings ?? 0) < 25;
  const isTrialActive = user.trialEndDate && isValidDate(user.trialEndDate) && new Date() < new Date(user.trialEndDate) && (user?.totalTrialEarnings ?? 0) < 25;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('profile')}</h1>
        <p className="text-gray-400">{t('accountInfo')}</p>
      </div>

      {/* User Information */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">{t('accountInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('email')}</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Calendar className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Üyelik Tarihi</p>
              <p className="text-white font-medium">
                {isValidDate(user.createdAt) ? format(new Date(user.createdAt), 'dd MMM yyyy') : 'Belirtilmemiş'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <span>{t('settings')}</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Dil / Language</span>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Balance and Earnings */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">{t('balanceEarnings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('totalBalance')}</p>
              <p className="text-2xl font-bold text-white">${(user?.balance ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-600/20">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('trialEarnings')}</p>
              <p className="text-2xl font-bold text-white">${(user?.totalTrialEarnings ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <Package className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('activePackage')}</p>
              <p className="text-xl font-bold text-white">{user.activePackage || t('freeTrial')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Status */}
      {!user.activePackage && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">{t('trialStatus')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-600/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Deneme Bitiş Tarihi</p>
                <p className="text-white font-medium">
                  {user.trialEndDate && isValidDate(user.trialEndDate) ? format(new Date(user.trialEndDate), 'dd MMM yyyy') : 'Belirtilmemiş'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${isTrialActive ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                <Clock className={`h-6 w-6 ${isTrialActive ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Durum</p>
                <p className={`font-medium ${isTrialActive ? 'text-green-400' : 'text-red-400'}`}>
                  {isTrialActive ? 'Aktif' : 'Süresi Doldu'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Deneme Kazanç İlerlemesi</span>
              <span>${(user?.totalTrialEarnings ?? 0).toFixed(2)} / $25.00</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                style={{ width: `${Math.min(((user?.totalTrialEarnings ?? 0) / 25) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Hesap İşlemleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
            <Package className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium">Paketleri Görüntüle</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-colors">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Para Çekme Talebi</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Son Aktiviteler</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">Hesap Oluşturuldu</p>
                <p className="text-sm text-gray-400">Ücretsiz deneme etkinleştirildi</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {isValidDate(user.createdAt) ? format(new Date(user.createdAt), 'dd MMM yyyy') : 'Belirtilmemiş'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
