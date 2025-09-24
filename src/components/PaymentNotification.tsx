import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Package } from '../types';
import { CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentNotificationProps {
  selectedPackage: Package;
  onClose: () => void;
}

export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  selectedPackage,
  onClose
}) => {
  const { user } = useAuth();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const notification = {
        userId: user.uid,
        packageId: selectedPackage.id,
        amount: selectedPackage.price,
        txHash: txHash.trim() || undefined,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      const notificationsRef = ref(database, 'paymentNotifications');
      await push(notificationsRef, notification);

      toast.success('Ödeme bildirimi gönderildi! 24 saat içinde incelenecek.');
      onClose();
    } catch (error) {
      toast.error('Ödeme bildirimi gönderilemedi');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Ödeme Bildirimi</h3>
        </div>

        <div className="mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <h4 className="text-white font-medium mb-2">{selectedPackage.name} Paketi</h4>
            <p className="text-2xl font-bold text-green-400">${selectedPackage.price}</p>
            <p className="text-sm text-gray-400">{selectedPackage.duration} gün süresi</p>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Ödeme Talimatları:</p>
                <p>1. Cüzdanımıza ${selectedPackage.price} USDT (TRC20) gönderin</p>
                <p>2. Aşağıya işlem hash'ini girin (isteğe bağlı)</p>
                <p>3. "Ödeme Bildir" butonuna tıklayın</p>
                <p>4. Admin onayını bekleyin (genellikle 24 saat içinde)</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="txHash" className="block text-sm font-medium text-gray-300 mb-2">
              İşlem Hash'i (İsteğe Bağlı)
            </label>
            <input
              id="txHash"
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Varsa işlem hash'ini girin"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Gönderiliyor...' : 'Ödeme Bildir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
