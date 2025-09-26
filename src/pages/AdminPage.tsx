import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push, get, update } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { PaymentNotification, WithdrawalRequest, User, ReferralBonus, SupportTicket } from '../types';
import { Check, X, Eye, DollarSign, Users, Package, AlertCircle, MessageCircle, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { calculateReferralBonus } from '../utils/miningCalculations';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [paymentNotifications, setPaymentNotifications] = useState<PaymentNotification[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [referralBonuses, setReferralBonuses] = useState<ReferralBonus[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'withdrawals' | 'users' | 'support' | 'referrals'>('payments');
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

    // Load support tickets
    const supportRef = ref(database, 'supportTickets');
    const supportUnsubscribe = onValue(supportRef, (snapshot) => {
      if (snapshot.exists()) {
        const tickets = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setSupportTickets(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    // Load referral bonuses
    const referralRef = ref(database, 'referralBonuses');
    const referralUnsubscribe = onValue(referralRef, (snapshot) => {
      if (snapshot.exists()) {
        const bonuses = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setReferralBonuses(bonuses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    return () => {
      paymentsUnsubscribe();
      withdrawalsUnsubscribe();
      usersUnsubscribe();
      supportUnsubscribe();
      referralUnsubscribe();
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
          
          // Calculate package expiry date
          const packageDuration = notification.packageId === 'starter' ? 30 : 
                                 notification.packageId === 'professional' ? 60 : 90;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + packageDuration);
          
          await set(userRef, {
            ...userData,
            activePackage: notification.packageId,
            packageActivatedAt: new Date().toISOString(),
            packageExpiresAt: expiryDate.toISOString()
          });

          // Referans bonusu kontrolü ve ödeme
          if (userData.referredBy) {
            const referralBonus = calculateReferralBonus(notification.amount);
            
            // Referans veren kullanıcıya bonus ekle
            const referrerRef = ref(database, `users/${userData.referredBy}`);
            const referrerSnapshot = await get(referrerRef);
            
            if (referrerSnapshot.exists()) {
              const referrerData = referrerSnapshot.val();
              await set(referrerRef, {
                ...referrerData,
                balance: (referrerData.balance || 0) + referralBonus,
                referralEarnings: (referrerData.referralEarnings || 0) + referralBonus
              });

              // Referans bonus kaydı oluştur
              const bonusRecord: Omit<ReferralBonus, 'id'> = {
                referrerId: userData.referredBy,
                referredUserId: notification.userId,
                packageId: notification.packageId,
                packageAmount: notification.amount,
                bonusAmount: referralBonus,
                status: 'paid',
                createdAt: new Date().toISOString(),
                paidAt: new Date().toISOString()
              };

              const bonusRef = ref(database, 'referralBonuses');
              await push(bonusRef, bonusRecord);
            }
          }
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

  const handleSupportTicket = async (ticketId: string, status: 'in-progress' | 'closed', adminResponse?: string) => {
    setLoading(true);
    try {
      const ticket = supportTickets.find(t => t.id === ticketId);
      if (!ticket) return;

      await set(ref(database, `supportTickets/${ticketId}`), {
        ...ticket,
        status,
        updatedAt: new Date().toISOString(),
        adminResponse: adminResponse || ticket.adminResponse,
        adminId: user?.uid
      });

      toast.success(`Destek talebi ${status === 'closed' ? 'kapatıldı' : 'işleme alındı'}`);
    } catch (error) {
      toast.error('Destek talebi güncellenemedi');
    }
    setLoading(false);
  };

  const banUser = async (userId: string, reason: string) => {
    setLoading(true);
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        await set(userRef, {
          ...userData,
          isBanned: true,
          banReason: reason,
          bannedAt: new Date().toISOString(),
          bannedBy: user?.uid
        });
        
        toast.success('Kullanıcı banlandı');
      }
    } catch (error) {
      toast.error('Kullanıcı banlanamadı');
    }
    setLoading(false);
  };

  const unbanUser = async (userId: string) => {
    setLoading(true);
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const { isBanned, banReason, bannedAt, bannedBy, ...cleanUserData } = userData;
        await set(userRef, cleanUserData);
        
        toast.success('Kullanıcı ban kaldırıldı');
      }
    } catch (error) {
      toast.error('Ban kaldırılamadı');
    }
    setLoading(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'beklemede';
      case 'approved': return 'onaylandı';
      case 'rejected': return 'reddedildi';
      case 'completed': return 'tamamlandı';
      case 'open': return 'açık';
      case 'in-progress': return 'işlemde';
      case 'closed': return 'kapalı';
      default: return status;
    }
  };

  const getTotalReferralEarnings = () => {
    return referralBonuses
      .filter(bonus => bonus.status === 'paid')
      .reduce((total, bonus) => total + bonus.bonusAmount, 0);
  };

  const getUserReferralCount = (userId: string) => {
    return users.filter(u => u.referredBy === userId).length;
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
    },
    {
      label: 'Açık Destek Talepleri',
      value: supportTickets.filter(t => t.status === 'open').length.toString(),
      icon: MessageCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      label: 'Toplam Referans Bonusu',
      value: `$${getTotalReferralEarnings().toFixed(2)}`,
      icon: UserCheck,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Yönetici Paneli</h1>
        <p className="text-gray-400">Ödemeleri, para çekmeleri ve kullanıcıları yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
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
          { id: 'users', label: 'Kullanıcı Yönetimi' },
          { id: 'support', label: 'Destek Talepleri' },
          { id: 'referrals', label: 'Referans Sistemi' }
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

      {/* Support Tickets */}
      {activeTab === 'support' && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Destek Talepleri</h3>
          <div className="space-y-4">
            {supportTickets.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Destek talebi yok</p>
            ) : (
              supportTickets.map((ticket) => {
                const ticketUser = users.find(u => u.uid === ticket.userId);
                return (
                  <div key={ticket.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white font-medium">{ticket.subject}</p>
                        <p className="text-sm text-gray-400">
                          Kullanıcı: {ticketUser?.email || 'Bilinmiyor'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Öncelik: <span className={`font-medium ${
                            ticket.priority === 'high' ? 'text-red-400' :
                            ticket.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`}>{ticket.priority}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Tarih: {format(new Date(ticket.createdAt), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.status === 'open' ? 'bg-blue-600/20 text-blue-400' :
                          ticket.status === 'in-progress' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-green-600/20 text-green-400'
                        }`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm">{ticket.message}</p>
                    </div>
                    
                    {ticket.adminResponse && (
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 font-medium text-sm mb-1">Admin Yanıtı:</p>
                        <p className="text-blue-200 text-sm">{ticket.adminResponse}</p>
                      </div>
                    )}
                    
                    {ticket.status !== 'closed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSupportTicket(ticket.id, 'in-progress')}
                          disabled={loading}
                          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          İşleme Al
                        </button>
                        <button
                          onClick={() => {
                            const response = prompt('Admin yanıtı (isteğe bağlı):');
                            handleSupportTicket(ticket.id, 'closed', response || undefined);
                          }}
                          disabled={loading}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          Kapat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Referral System */}
      {activeTab === 'referrals' && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Referans Sistemi</h3>
          
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Toplam Referans Bonusu</h4>
              <p className="text-2xl font-bold text-green-400">${getTotalReferralEarnings().toFixed(2)}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Aktif Referanslar</h4>
              <p className="text-2xl font-bold text-blue-400">
                {users.filter(u => u.referredBy).length}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Bekleyen Bonuslar</h4>
              <p className="text-2xl font-bold text-yellow-400">
                ${referralBonuses
                  .filter(b => b.status === 'pending')
                  .reduce((total, b) => total + b.bonusAmount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Top Referrers */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-4">En Çok Referans Yapanlar</h4>
            <div className="space-y-2">
              {users
                .map(user => ({
                  ...user,
                  referralCount: getUserReferralCount(user.uid)
                }))
                .filter(user => user.referralCount > 0)
                .sort((a, b) => b.referralCount - a.referralCount)
                .slice(0, 10)
                .map((user, index) => (
                  <div key={user.uid} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-medium">#{index + 1}</span>
                      <span className="text-white">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-blue-400">{user.referralCount} referans</span>
                      <span className="text-green-400">${(user.referralEarnings || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            </div>
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
                  <th className="pb-3 text-gray-400">Referans</th>
                  <th className="pb-3 text-gray-400">Durum</th>
                  <th className="pb-3 text-gray-400">Katılım</th>
                  <th className="pb-3 text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData.uid} className="border-b border-gray-700/50">
                    <td className="py-3 text-white">{userData.email}</td>
                    <td className="py-3 text-green-400">${userData.balance.toFixed(2)}</td>
                    <td className="py-3 text-white">{userData.activePackage || 'Ücretsiz Deneme'}</td>
                    <td className="py-3 text-blue-400">{getUserReferralCount(userData.uid)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        userData.isBanned ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
                      }`}>
                        {userData.isBanned ? 'Banlı' : 'Aktif'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {format(new Date(userData.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        {userData.isBanned ? (
                          <button
                            onClick={() => unbanUser(userData.uid)}
                            disabled={loading}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-50"
                          >
                            Ban Kaldır
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const reason = prompt('Ban sebebi:');
                              if (reason) banUser(userData.uid, reason);
                            }}
                            disabled={loading}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs disabled:opacity-50"
                          >
                            Banla
                          </button>
                        )}
                      </div>
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
