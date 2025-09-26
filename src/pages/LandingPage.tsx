// src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';
import { Pickaxe, Shield, Zap, DollarSign, Target, RotateCcw, Smartphone } from 'lucide-react';
import { SecurityBanner } from '../components/SecurityBanner';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Add scroll effect to header
    const handleScroll = () => {
      const header = document.querySelector('.landing-header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Update meta tags based on language
  useEffect(() => {
    document.title = t('heroTitle') + ' | CryptoCloud Mining';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('heroSubtitle'));
    }
  }, [t]);

  const faqData = [
    {
      question: "Kripto para madenciliği nedir?",
      answer: "Kripto para madenciliği, blockchain ağının işlemlerini doğrulama ve yeni bloklar oluşturma sürecidir. Bu süreçte madenciler kripto para ödülleri kazanırlar. FreeCloudMiner ile bu süreci profesyonel donanımlarımız üzerinden gerçekleştirip kazancınızdan pay alırsınız."
    },
    {
      question: "Ücretsiz deneme nasıl çalışır?",
      answer: "Yeni üyelerimize 3 aylık süre ile $25 kazanç limitinde ücretsiz madencilik imkanı sunuyoruz. Bu süre zarfında tüm özelliklerimizi test edebilir ve platformumuzun güvenilirliğini deneyimleyebilirsiniz."
    },
    {
      question: "Kazançlarım ne zaman ödenir?",
      answer: "Kazançlarınız günlük olarak hesaplanır ve bakiyenize eklenir. Minimum $10 tutarından itibaren para çekme talebinde bulunabilirsiniz. Ödemeler 24-48 saat içinde USDT olarak cüzdanınıza gönderilir."
    },
    {
      question: "Hangi kripto paraların madenciliğini yapabilirim?",
      answer: "Platformumuzda Bitcoin (BTC), Ethereum (ETH), Dogecoin (DOGE) ve Litecoin (LTC) madenciliği yapabilirsiniz. Her kripto para için farklı kazanç oranları ve hash güçleri mevcuttur."
    },
    {
      question: "Platform güvenli mi?",
      answer: "Evet, platformumuz SSL şifreleme, iki faktörlü doğrulama ve soğuk cüzdan saklama gibi en yüksek güvenlik önlemleri ile korunmaktadır. Ayrıca düzenli olarak güvenlik denetimlerinden geçmekteyiz."
    }
  ];

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="landing-header fixed top-0 w-full z-50 transition-all duration-300 bg-gray-800/95 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Pickaxe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CryptoCloud Mining</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#özellikler" className="text-gray-300 hover:text-white transition-colors">{t('whyChooseUs')}</a>
              <a href="#madencilik" className="text-gray-300 hover:text-white transition-colors">{t('mining')}</a>
              <a href="#paketler" className="text-gray-300 hover:text-white transition-colors">{t('packages')}</a>
              <a href="#sss" className="text-gray-300 hover:text-white transition-colors">SSS</a>
            </div>
            
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            
            <Link 
              to="/auth" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {t('freeBonus')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Security Banner */}
          <SecurityBanner />
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              {t('heroTitle')}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/auth" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>🎁</span>
                <span>{t('freeBonus')}</span>
              </Link>
              
              <a 
                href="#özellikler" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-105"
              >
                {t('howItWorks')}
              </a>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">75K+</h3>
                <p className="text-gray-300">Aktif Madenci</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">$4.2M+</h3>
                <p className="text-gray-300">Toplam Ödeme</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">99.9%</h3>
                <p className="text-gray-300">Uptime</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">24/7</h3>
                <p className="text-gray-300">Destek</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="özellikler" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{t('whyChooseUs')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('heroSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('secureTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('secureDesc')}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('highPerformanceTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('highPerformanceDesc')}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('dailyPaymentsTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('dailyPaymentsDesc')}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kolay Kullanım</h3>
              <p className="text-gray-300 leading-relaxed">
                Kullanıcı dostu arayüz ile bir kaç tıkla madenciliğe başlayın. 
                Teknik bilgi gerektirmez, herkes kullanabilir.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Otomatik Sistem</h3>
              <p className="text-gray-300 leading-relaxed">
                Tamamen otomatik madencilik sistemi. Bir kez başlattıktan sonra 
                pasif gelir elde etmeye devam edin.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mobil Uyumlu</h3>
              <p className="text-gray-300 leading-relaxed">
                Mobil cihazlarınızdan madenciliğinizi takip edin ve yönetin. 
                İOS ve Android uyumlu responsive tasarım.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Coins */}
      <section id="madencilik" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Desteklenen Kripto Paralar</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              8 farklı kripto paranın madenciliğini yapın ve portföyünüzü çeşitlendirin
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-orange-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-orange-400 to-orange-600">
                ₿
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bitcoin</h3>
              <p className="text-gray-400 mb-4">BTC</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %3.5 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                Ξ
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ethereum</h3>
              <p className="text-gray-400 mb-4">ETH</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %4.2 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-purple-500 to-pink-600">
                ◎
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Solana</h3>
              <p className="text-gray-400 mb-4">SOL</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %5.1 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-yellow-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-yellow-500 to-yellow-600">
                Ð
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Dogecoin</h3>
              <p className="text-gray-400 mb-4">DOGE</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %2.8 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-gray-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-gray-400 to-gray-600">
                Ł
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Litecoin</h3>
              <p className="text-gray-400 mb-4">LTC</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %3.1 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-800">
                ₳
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Cardano</h3>
              <p className="text-gray-400 mb-4">ADA</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %3.8 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-pink-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-pink-500 to-purple-600">
                ●
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Polkadot</h3>
              <p className="text-gray-400 mb-4">DOT</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %4.5 ROI
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-purple-600 to-indigo-600">
                ⬟
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Polygon</h3>
              <p className="text-gray-400 mb-4">MATIC</p>
              <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                Günlük %4.8 ROI
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">Ve daha fazlası yakında...</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <span>• Chainlink (LINK)</span>
              <span>• Avalanche (AVAX)</span>
              <span>• Cosmos (ATOM)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="paketler" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Madencilik Paketleri</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              İhtiyacınıza uygun paketi seçin ve kazancınızı maksimize edin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 transition-all hover:transform hover:scale-105">
              <h3 className="text-2xl font-bold text-white text-center mb-4">Başlangıç</h3>
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-blue-400">$99</span>
                <span className="text-gray-400 text-xl">/30 gün</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">90 gün madencilik</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">2KH/s hash gücü</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Günlük $3.5 kazanç</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Haftalık para çekme</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">7/24 destek</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="w-full block text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Paketi Seç
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-500 transition-all hover:transform hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                <span>👑</span>
                <span>En Popüler</span>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4 mt-4">Profesyonel</h3>
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-blue-400">$299</span>
                <span className="text-gray-400 text-xl">/60 gün</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">90 gün madencilik</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">7.5KH/s hash gücü</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Günlük $12 kazanç</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Günlük para çekme</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Öncelikli destek</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Bonus %20 kazanç</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="w-full block text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Paketi Seç
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 transition-all hover:transform hover:scale-105">
              <h3 className="text-2xl font-bold text-white text-center mb-4">Kurumsal</h3>
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-blue-400">$599</span>
                <span className="text-gray-400 text-xl">/90 gün</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">90 gün madencilik</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">15KH/s hash gücü</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Günlük $25 kazanç</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Anlık para çekme</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">VIP destek</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-gray-300">Bonus %35 kazanç</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="w-full block text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Paketi Seç
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="sss" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Sık Sorulan Sorular</h2>
            <p className="text-xl text-gray-300">
              Kripto para madenciliği hakkında merak ettikleriniz
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-lg">{faq.question}</span>
                  <span className="text-2xl text-blue-400 font-bold">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Hemen Başlayın, Kazanmaya Devam Edin
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ücretsiz deneme ile risk almadan kripto para madenciliğine başlayın. 
            $25 bonus ile kazancınızı test edin.
          </p>
          <Link 
            to="/auth"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>🚀</span>
            <span>Şimdi Başla - Ücretsiz</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Pickaxe className="h-8 w-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">CryptoCloud Mining</span>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Kripto para madenciliğinde Avrupa'nın en güvenilir platformu. 
              Profesyonel hizmet ile pasif gelir elde edin.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <a href="#hakkımızda" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</a>
            <a href="#güvenlik" className="text-gray-300 hover:text-white transition-colors">Güvenlik</a>
            <a href="#destek" className="text-gray-300 hover:text-white transition-colors">Destek</a>
            <a href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
            <a href="#kariyer" className="text-gray-300 hover:text-white transition-colors">Kariyer</a>
            <a href="#iletişim" className="text-gray-300 hover:text-white transition-colors">İletişim</a>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 CryptoCloud Mining GmbH. Tüm hakları saklıdır. | 
              <a href="#gizlilik" className="hover:text-white transition-colors"> Gizlilik Politikası</a> | 
              <a href="#şartlar" className="hover:text-white transition-colors"> Kullanım Şartları</a>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Berliner Allee 12, 40212 Düsseldorf, Germany
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
