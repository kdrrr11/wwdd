import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Pickaxe, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun');
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
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Kimlik doğrulama başarısız');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Pickaxe className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CloudMiner</h1>
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
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E-posta adresinizi girin"
                required
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
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Hesabınız yok mu?" : 'Zaten hesabınız var mı?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <div className="mt-6 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <h4 className="text-blue-400 font-semibold mb-2">Ücretsiz Deneme Dahil!</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 3 ay ücretsiz madencilik</li>
                <li>• 25 USDT'ye kadar kazanç</li>
                <li>• Tüm coinler kullanılabilir</li>
                <li>• Ödeme gerekmez</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
