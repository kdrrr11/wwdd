import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Crown, Zap, TrendingUp, X, Gift } from 'lucide-react';

export const UpgradePrompt: React.FC = () => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Sadece trial kullanıcıları için göster
    if (!user?.activePackage && !dismissed) {
      // İlk 30 saniye sonra göster
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [user, dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // 10 dakika sonra tekrar göster
    setTimeout(() => {
      setDismissed(false);
    }, 600000);
  };

  if (!showPrompt || user?.activePackage) return null;

  const trialProgress = ((user?.totalTrialEarnings || 0) / 25) * 100;
  const isNearLimit = trialProgress > 70;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 shadow-2xl animate-pulse">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Crown className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {isNearLimit ? 'Limit Yaklaşıyor!' : 'Premium\'a Geç!'}
            </h3>
            <p className="text-blue-100 text-xs">
              {isNearLimit 
                ? `Sadece $${(25 - (user?.totalTrialEarnings || 0)).toFixed(2)} kaldı`
                : 'Sınırsız kazanç için yükselt'
              }
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-xs text-blue-100">
            <Zap className="h-3 w-3" />
            <span>5x daha hızlı madencilik</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-blue-100">
            <TrendingUp className="h-3 w-3" />
            <span>Günlük $25'e kadar kazanç</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-blue-100">
            <Gift className="h-3 w-3" />
            <span>Sınırsız para çekme</span>
          </div>
        </div>

        <Link
          to="/packages"
          onClick={() => setShowPrompt(false)}
          className="block w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg text-center text-sm transition-all transform hover:scale-105"
        >
          Şimdi Yükselt
        </Link>
      </div>
    </div>
  );
};