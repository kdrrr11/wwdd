import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Pickaxe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // URL'den referans kodunu al
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Geçerli bir e-posta adresi girin');
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Tekrar hoşgeldiniz!');
      } else {
        await register(email, password);
        toast.success('Hesap başarıyla oluşturuldu!');
      }
      
      // Navigation will be handled by the auth state change
      // navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Kimlik doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setReferralCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Ana sayfaya dön butonu */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Pickaxe className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FreeCloudMiner</h1>
            <p className="text-gray-400">
              {isLogin ? 'Madenciliğe tekrar hoşgeldiniz' : 'Madencilik yolculuğunuzu başlatın'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="E-posta adresinizi girin"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Şifrenizi girin"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="referral" className="block text-sm font-medium text-gray-300 mb-2">
                  Referans Kodu (İsteğe Bağlı)
                </label>
                <input
                  id="referral"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Referans kodunu girin"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>İşleniyor...</span>
                </div>
              ) : (
                isLogin ? 'Giriş Yap' : 'Kayıt Ol'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Hesabınız yok mu?" : 'Zaten hesabınız var mı?'}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center space-x-2">
                <span>🎁</span>
                <span>Ücretsiz Deneme Dahil!</span>
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 3 ay ücretsiz madencilik</li>
                <li>• 25 USDT'ye kadar kazanç</li>
                <li>• Tüm coinler kullanılabilir</li>
                <li>• Ödeme gerekmez</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Güven göstergeleri */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <span>🔒</span>
              <span>SSL Güvenli</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Hızlı İşlem</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🛡️</span>
              <span>Güvenilir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
