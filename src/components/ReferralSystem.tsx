import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { Share2, Copy, Users, DollarSign, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReferralSystem: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!user) return null;

  const referralLink = `${window.location.origin}/auth?ref=${user.referralCode || 'LOADING'}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success(t('success') + ': Referans linki kopyalandı!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error(t('error') + ': Link kopyalanamadı');
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CryptoCloud Mining - Ücretsiz Kripto Madenciliği',
          text: 'Benimle birlikte kripto para kazanmaya başla! Ücretsiz deneme ile $25 bonus kazan.',
          url: referralLink
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 md:p-6 border border-purple-500/30">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-600/20">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">Referans Sistemi</h3>
          <p className="text-sm text-gray-300">Arkadaşlarını davet et, %20 bonus kazan!</p>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Gift className="h-4 w-4 text-green-400" />
            <p className="text-xs text-gray-400">Referans Kazancı</p>
          </div>
          <p className="text-lg font-bold text-green-400">
            ${(user.referralEarnings ?? 0).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-gray-400">Davet Edilen</p>
          </div>
          <p className="text-lg font-bold text-blue-400">0</p>
            {user.totalReferrals || 0}
      </div>

      {/* Referral Link */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Referans Linkin
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm"
            />
            <button
              onClick={copyReferralLink}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-1"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">
                {copiedLink ? 'Kopyalandı!' : t('copyAddress')}
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={shareReferralLink}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Arkadaşlarını Davet Et</span>
        </button>
      </div>

      {/* How it works */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <h4 className="text-white font-medium mb-2 text-sm">Nasıl Çalışır?</h4>
        <div className="text-xs text-gray-300 space-y-2">
          <p>
            Paylaşım linkinizi kendi URL'nizle oluşturun ve kullanıcı ID'nizi ekleyin. Örneğin:
          </p>
          <div className="bg-gray-700/50 p-2 rounded font-mono text-blue-300">
            {referralLink}
          </div>
          <p>
            Bu link üzerinden kayıt olan kullanıcılar sisteme otomatik olarak eklenecek. 
            Ayrıca, link ile kayıt olan kullanıcılar bir paket satın alırsa, size komisyon 
            otomatik olarak yansıtılacaktır. Sistem tüm kayıtları ve komisyonları takip eder, 
            böylece kazançlarınız şeffaf ve güvenli şekilde hesaplanır.
          </p>
        </div>
      </div>
    </div>
  );
};