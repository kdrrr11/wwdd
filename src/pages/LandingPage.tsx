// src/pages/LandingPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pickaxe } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    console.log('Auth butonu tıklandı');
    navigate('/auth');
  };

  console.log('LandingPage yüklendi');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Test için basit header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Pickaxe className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FreeCloudMiner</span>
          </div>
          
          {/* Test butonları */}
          <div className="space-x-4">
            {/* Link ile test */}
            <Link 
              to="/auth" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Link ile Auth
            </Link>
            
            {/* Navigate ile test */}
            <button 
              onClick={handleAuthClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Navigate ile Auth
            </button>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            TEST - Landing Page Çalışıyor
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Bu sayfa açıldıysa Landing Page doğru çalışıyor. Auth butonlarını test edin.
          </p>
          
          <div className="space-y-4">
            {/* Ana CTA butonları */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105"
              >
                🎁 Ücretsiz Başla (Link)
              </Link>
              
              <button 
                onClick={() => {
                  console.log('Navigate butonu tıklandı');
                  navigate('/auth');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105"
              >
                🚀 Şimdi Başla (Navigate)
              </button>
            </div>
            
            {/* Debug bilgileri */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Debug Bilgileri:</h3>
              <p className="text-gray-300 text-sm">Current URL: {window.location.pathname}</p>
              <p className="text-gray-300 text-sm">
                Bu butonlara tıklayınca console'u kontrol edin (F12 → Console)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
