import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { WithdrawalRequest } from '../types';
import { DollarSign, Clock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const WithdrawalPage: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  const minWithdrawal = 10;
  const maxWithdrawal = user?.balance || 0;

  useEffect(() => {
    if (!user) return;

    const requestsRef = ref(database, 'withdrawalRequests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        const requests = Object.entries(snapshot.val())
          .map(([key, value]: [string, any]) => ({ id: key, ...value }))
          .filter((request: WithdrawalRequest) => request.userId === user.uid)
          .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
        setWithdrawalRequests(requests);
      } else {
        setWithdrawalRequests([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const withdrawalAmount = parseFloat(amount);
    
    if (withdrawalAmount < minWithdrawal) {
      toast.error(`Minimum para çekme tutarı $${minWithdrawal}'dır`);
      return;
    }

    if (withdrawalAmount > maxWithdrawal) {
      toast.error('Yetersiz bakiye');
      return;
    }

    if (!walletAddress.trim()) {
      toast.error('Lütfen geçerli bir cüzdan adresi girin');
      return;
    }

    setLoading(true);
    try {
      const newRequest: Omit<WithdrawalRequest, 'id'> = {
        userId: user.uid,
        amount: withdrawalAmount,
        walletAddress: walletAddress.trim(),
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      const requestsRef = ref(database, 'withdrawalRequests');
      await push(requestsRef, newRequest);

      toast.success('Para çekme talebi başarıyla gönderildi!');
      setAmount('');
      setWalletAddress('');
    } catch (error) {
      toast.error('Para çekme talebi gönderilemedi');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600/20 text-yellow-400';
      case 'approved': return 'bg-blue-600/20 text-blue-400';
      case 'completed': return 'bg-green-600/20 text-green-400';
      case 'rejected': return 'bg-red-600/20 text-red-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <Check className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'completed': return 'Tamamlandı';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Para Çekme</h1>
        <p className="text-gray-400">Kazançlarınızı çekme talebi gönderin</p>
      </div>

      {/* Balance Info */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-green-600/20">
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Kullanılabilir Bakiye</p>
            <p className="text-3xl font-bold text-white">${user?.balance.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Para Çekme Talebi</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Tutar (USD)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min={minWithdrawal}
              max={maxWithdrawal}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Min: $${minWithdrawal}, Max: $${maxWithdrawal.toFixed(2)}`}
              required
            />
          </div>

          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-300 mb-2">
              TRC20 Cüzdan Adresi
            </label>
            <input
              id="wallet"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="TRC20 cüzdan adresinizi girin"
              required
            />
          </div>

          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Para Çekme Bilgileri</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Minimum para çekme: ${minWithdrawal}</li>
              <li>• İşlem süresi: 24-48 saat</li>
              <li>• Para çekme işlemleri USDT (TRC20) olarak yapılır</li>
              <li>• Cüzdan adresinizin doğru olduğundan emin olun</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !amount || !walletAddress || parseFloat(amount || '0') < minWithdrawal}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Gönderiliyor...' : 'Para Çekme Talebi'}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Para Çekme Geçmişi</h3>
        
        {withdrawalRequests.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz para çekme talebi yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawalRequests.map((request) => (
              <div key={request.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">${request.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(request.requestedAt), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span>{getStatusText(request.status)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p className="mb-1">Cüzdan: {request.walletAddress}</p>
                  {request.adminNotes && (
                    <p className="text-yellow-400">Not: {request.adminNotes}</p>
                  )}
                  {request.processedAt && (
                    <p>İşlenme: {format(new Date(request.processedAt), 'dd MMM yyyy HH:mm')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
