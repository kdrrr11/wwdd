import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push, get } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { PaymentNotification, WithdrawalRequest, User } from '../types';
import { Check, X, Eye, DollarSign, Users, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [paymentNotifications, setPaymentNotifications] = useState<PaymentNotification[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'withdrawals' | 'users'>('payments');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) return;

    // Load payment notifications
    const paymentsRef = ref(database, 'paymentNotifications');
    const paymentsUnsubscribe = onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const payments = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setPaymentNotifications(payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    // Load withdrawal requests
    const withdrawalsRef = ref(database, 'withdrawalRequests');
    const withdrawalsUnsubscribe = onValue(withdrawalsRef, (snapshot) => {
      if (snapshot.exists()) {
        const withdrawals = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setWithdrawalRequests(withdrawals.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));
      }
    });

    // Load users
    const usersRef = ref(database, 'users');
    const usersUnsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          uid: key,
          ...value
        }));
        setUsers(usersData);
      }
    });

    return () => {
      paymentsUnsubscribe();
      withdrawalsUnsubscribe();
      usersUnsubscribe();
    };
  }, [user]);

  const handlePaymentApproval = async (notificationId: string, approved: boolean, adminNotes?: string) => {
    setLoading(true);
    try {
      const notification = paymentNotifications.find(p => p.id === notificationId);
      if (!notification) return;

      // Update payment notification
      await set(ref(database, `paymentNotifications/${notificationId}`), {
        ...notification,
        status: approved ? 'approved' : 'rejected',
        approvedAt: new Date().toISOString(),
        adminNotes: adminNotes || ''
      });

      if (approved) {
        // Activate package for user
        const userRef = ref(database, `users/${notification.userId}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          await set(userRef, {
            ...userData,
            activePackage: notification.packageId,
            packageActivatedAt: new Date().toISOString()
          });
        }
      }

      toast.success(`Ödeme ${approved ? 'onaylandı' : 'reddedildi'}`);
    } catch (error) {
      toast.error('Ödeme işlenemedi');
    }
    setLoading(false);
  };

  const handleWithdrawalApproval = async (requestId: string, approved: boolean, adminNotes?: string) => {
    setLoading(true);
    try {
      const request = withdrawalRequests.find(w => w.id === requestId);
      if (!request) return;

      await set(ref(database, `withdrawalRequests/${requestId}`), {
        ...request,
        status: approved ? 'approved' : 'rejected',
        processedAt: new Date().toISOString(),
        adminNotes: adminNotes || ''
      });

      if (approved) {
        // Deduct from user balance
        const userRef = ref(database, `users/${request.userId}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          await set(userRef, {
            ...userData,
            balance: Math.max(0, userData.balance - request.amount)
          });
        }
      }

      toast.success(`Para çekme ${approved ? 'onaylandı' : 'reddedildi'}`);
    } catch (error) {
      toast.error('Para çekme işlenemedi');
    }
    setLoading(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'beklemede';
      case 'approved': return 'onaylandı';
      case 'rejected': return 'reddedildi';
      case 'completed': return 'tamamlandı';
      default: return status;
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erişim Engellendi</h2>
          <p className="text-gray-400">Yönetici yetkiniz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Toplam Kullanıcı',
      value: users.length.toString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      label: 'Bekleyen Ödemeler',
      value: paymentNotifications.filter(p => p.status === 'pending').length.toString(),
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    },
    {
      label: 'Bekleyen Para Çekmeler',
      value: withdrawalRequests.filter(w => w.status === 'pending').length.toString(),
      icon: Package,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Yönetici Paneli</h1>
        <p className="text-gray-400">Ödemeleri, para çekmeleri ve kullanıcıları yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'payments', label: 'Ödeme Bildirimleri' },
          { id: 'withdrawals', label: 'Para Çekme Talepleri' },
          { id: 'users', label: 'Kullanıcı Yönetimi' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Notifications */}
      {activeTab === 'payments' && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Ödeme Bildirimleri</h3>
          <div className="space-y-4">
            {paymentNotifications.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Ödeme bildirimi yok</p>
            ) : (
              paymentNotifications.map((notification) => (
                <div key={notification.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Paket: {notification.packageId}</p>
                      <p className="text-sm text-gray-400">Tutar: ${notification.amount}</p>
                      <p className="text-sm text-gray-400">
                        Tarih: {format(new Date(notification.createdAt), 'dd MMM yyyy HH:mm')}
                      </p>
                      {notification.txHash && (
                        <p className="text-sm text-gray-400">TX: {notification.txHash}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        notification.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        notification.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {getStatusText(notification.status)}
                      </span>
                    </div>
                  </div>
                  
                  {notification.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePaymentApproval(notification.id, true)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        <span>Onayla</span>
                      </button>
                      <button
                        onClick={() => handlePaymentApproval(notification.id, false)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        <span>Reddet</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Withdrawal Requests */}
      {activeTab === 'withdrawals' && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Para Çekme Talepleri</h3>
          <div className="space-y-4">
            {withdrawalRequests.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Para çekme talebi yok</p>
            ) : (
              withdrawalRequests.map((request) => (
                <div key={request.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Tutar: ${request.amount}</p>
                      <p className="text-sm text-gray-400">Cüzdan: {request.walletAddress}</p>
                      <p className="text-sm text-gray-400">
                        Tarih: {format(new Date(request.requestedAt), 'dd MMM yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        request.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleWithdrawalApproval(request.id, true)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        <span>Onayla</span>
                      </button>
                      <button
                        onClick={() => handleWithdrawalApproval(request.id, false)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        <span>Reddet</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Kullanıcı Yönetimi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400">E-posta</th>
                  <th className="pb-3 text-gray-400">Bakiye</th>
                  <th className="pb-3 text-gray-400">Paket</th>
                  <th className="pb-3 text-gray-400">Deneme Kazancı</th>
                  <th className="pb-3 text-gray-400">Katılım</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData.uid} className="border-b border-gray-700/50">
                    <td className="py-3 text-white">{userData.email}</td>
                    <td className="py-3 text-green-400">${userData.balance.toFixed(2)}</td>
                    <td className="py-3 text-white">{userData.activePackage || 'Ücretsiz Deneme'}</td>
                    <td className="py-3 text-blue-400">${userData.totalTrialEarnings.toFixed(2)}</td>
                    <td className="py-3 text-gray-400">
                      {format(new Date(userData.createdAt), 'dd MMM yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
