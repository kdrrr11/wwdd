// src/types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  trialStartDate?: string;
  trialEndDate?: string;
  totalTrialEarnings: number;
  balance: number;
  activePackage?: string | null;
  packageActivatedAt?: string;
  isAdmin?: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  hashRate: number;
  dailyEarning: number;
  weeklyWithdrawal: boolean;
  description: string;
  popular?: boolean;
}

export interface MiningSession {
  id: string;
  userId: string;
  coin: string;
  startTime: string;
  endTime?: string;
  hashRate: number;
  totalEarned: number;
  isActive: boolean;
  packageId?: string | null; // Optional olarak tanımlandı
  lastUpdated?: string;
  createdAt?: string; // Güvenlik için oluşturulma zamanı
  lastServerUpdate?: number; // Server timestamp for validation
  userAgent?: string; // Güvenlik için user agent
}

export interface PaymentNotification {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  txHash?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  baseHashRate: number;
  baseEarning: number;
  color: string;
}
