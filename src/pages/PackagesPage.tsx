import React, { useState } from 'react';
import { PaymentNotification } from '../components/PaymentNotification';
import { Package } from '../types';
import { Check, Crown, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const PackagesPage: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  // This would normally come from Firebase
  const packages: Package[] = [
    {
      id: 'starter',
      name: 'Başlangıç',
      price: 99,
      duration: 30,
      hashRate: 500,
      dailyEarning: 3.5,
      weeklyWithdrawal: true,
      description: 'Yeni başlayanlar için mükemmel',
    },
    {
      id: 'professional',
      name: 'Profesyonel',
      price: 299,
      duration: 60,
      hashRate: 1500,
      dailyEarning: 12,
      weeklyWithdrawal: true,
      description: 'Ciddi madenciler için en iyi değer',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: 599,
      duration: 90,
      hashRate: 3000,
      dailyEarning: 25,
      weeklyWithdrawal: true,
      description: 'Maksimum kazanç potansiyeli',
    },
  ];

  const trcAddress = "TMjSDNto6hoHUV9udDcXVAtuxxX6cnhhv3";

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(trcAddress);
      setCopiedAddress(true);
      toast.success('Adres panoya kopyalandı!');
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      toast.error('Adres kopyalanamadı');
    }
  };

  const handlePurchase = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Madencilik Paketleri</h1>
        <p className="text-gray-400">Madencilik ihtiyaçlarınız için mükemmel planı seçin</p>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">Ödeme Talimatları</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-white font-medium">TRC20 USDT Adresi</p>
              <p className="text-sm text-gray-400">Bu adrese ödeme gönderin</p>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
            >
              <Copy className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400">{copiedAddress ? 'Kopyalandı!' : 'Kopyala'}</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50">
            <p className="text-white font-mono text-sm break-all">{trcAddress}</p>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>1. Yukarıdaki adrese USDT (TRC20) gönderin</p>
            <p>2. Gönderdikten sonra "Ödeme Bildirimi" butonuna tıklayın</p>
            <p>3. Admin onayını bekleyin (genellikle 24 saat içinde)</p>
            <p>4. Yeni paketinizle madenciliğe başlayın!</p>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border transition-all hover:scale-105 ${
              pkg.popular
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-700'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Crown className="h-4 w-4" />
                  <span>En Popüler</span>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
              <div className="text-4xl font-bold text-white mb-2">
                ${pkg.price}
                <span className="text-lg text-gray-400">/ay</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">{pkg.duration} gün süresi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">{pkg.hashRate.toLocaleString()} H/s</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">${pkg.dailyEarning}/gün tahmini</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Haftalık para çekme</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">7/24 destek</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(pkg)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Paket Seç
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Sıkça Sorulan Sorular</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Onay ne kadar sürer?</h4>
            <p className="text-gray-400">Paket aktivasyonları genellikle ödeme onayından sonra 24 saat içinde işlenir.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Paketimi yükseltebilir miyim?</h4>
            <p className="text-gray-400">Evet, istediğiniz zaman yükseltebilirsiniz. Paket yükseltmeleri için destekle iletişime geçin.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Gizli ücretler var mı?</h4>
            <p className="text-gray-400">Gizli ücret yoktur. Gösterilen fiyat, tüm paket süresi için ödeyeceğiniz tek tutardır.</p>
          </div>
        </div>
      </div>

      {/* Payment Notification Modal */}
      {selectedPackage && (
        <PaymentNotification
          selectedPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
};
