// src/utils/miningCalculations.ts
export interface MiningCalculation {
  hashRateMultiplier: number;
  earningMultiplier: number;
  dailyEarningBonus: number;
}

export interface User {
  id: string;
  isBanned?: boolean;
  activePackage?: string;
  trialEndDate?: string | Date;
  totalTrialEarnings?: number;
}

export const getPackageMultipliers = (packageId?: string): MiningCalculation => {
  const multipliers: Record<string, MiningCalculation> = {
    starter: {
      hashRateMultiplier: 2.0,
      earningMultiplier: 1.5,
      dailyEarningBonus: 3.5
    },
    professional: {
      hashRateMultiplier: 3.5,
      earningMultiplier: 2.5,
      dailyEarningBonus: 12.0
    },
    enterprise: {
      hashRateMultiplier: 5.0,
      earningMultiplier: 4.0,
      dailyEarningBonus: 25.0
    }
  };

  return multipliers[packageId || ''] || {
    hashRateMultiplier: 1.0,
    earningMultiplier: 1.0,
    dailyEarningBonus: 0
  };
};

export const calculateMiningEarnings = (
  baseEarning: number,
  hashRate: number,
  baseHashRate: number,
  elapsedHours: number,
  packageId?: string
): number => {
  // Güvenlik kontrolleri
  if (baseEarning < 0 || hashRate < 0 || baseHashRate <= 0 || elapsedHours < 0) {
    console.warn('Invalid parameters for mining calculation');
    return 0;
  }
  
  // Maksimum süre kontrolü (24 saat)
  const clampedElapsedHours = Math.min(elapsedHours, 24);
  
  const multipliers = getPackageMultipliers(packageId);
  const hashRateRatio = hashRate / baseHashRate;
  
  // Maksimum multiplier kontrolü
  const maxMultiplier = packageId ? 10 : 1; // Premium paketler için max 10x, trial için 1x
  const effectiveMultiplier = Math.min(multipliers.earningMultiplier, maxMultiplier);
  
  const hourlyEarning = baseEarning * hashRateRatio * effectiveMultiplier;
  
  // Sonuç kontrolü
  const result = hourlyEarning * clampedElapsedHours;
  
  // Makul olmayan kazanç kontrolü
  const maxReasonableEarning = baseEarning * 10 * clampedElapsedHours;
  if (result > maxReasonableEarning) {
    console.warn('Calculated earnings exceed reasonable limits');
    return maxReasonableEarning;
  }
  
  return Math.max(0, result);
};

export const calculateHashRate = (baseHashRate: number, packageId?: string): number => {
  if (baseHashRate <= 0) {
    console.warn('Invalid base hash rate');
    return 1000; // Default hash rate
  }
  
  // GÜVENLİK: Sadece onaylanmış paketler için hash rate artışı
  if (!packageId) {
    // Paket yoksa sadece base hash rate
    return baseHashRate;
  }
  
  const multipliers = getPackageMultipliers(packageId);
  const result = Math.floor(baseHashRate * multipliers.hashRateMultiplier);
  
  return Math.max(baseHashRate, result);
};

export const canUserMine = (user: User | null | undefined): boolean => {
  if (!user) return false;
  
  // Ban kontrolü
  if (user.isBanned) return false;
  
  // Check if user has active package
  if (user.activePackage) return true;
  
  // Check trial status
  const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null;
  const now = new Date();
  const trialActive = trialEndDate && now < trialEndDate;
  const earningsWithinLimit = (user.totalTrialEarnings || 0) < 25;
  
  return trialActive && earningsWithinLimit;
};

export const formatHashRate = (hashRate: number): string => {
  if (hashRate <= 0) return '0H/s';
  
  if (hashRate >= 1000000) {
    return `${(hashRate / 1000000).toFixed(1)}MH/s`;
  } else if (hashRate >= 1000) {
    return `${(hashRate / 1000).toFixed(1)}KH/s`;
  }
  return `${hashRate}H/s`;
};

// Yardımcı fonksiyonlar
export const validateMiningParameters = (
  baseEarning: number,
  hashRate: number,
  baseHashRate: number,
  elapsedHours: number
): boolean => {
  return baseEarning >= 0 && 
         hashRate >= 0 && 
         baseHashRate > 0 && 
         elapsedHours >= 0;
};

export const getMaxTrialEarnings = (): number => {
  return 25;
};

export const getMaxDailyHours = (): number => {
  return 24;
};

export const generateDeviceFingerprint = (): string => {
  // Cihaz parmak izi oluşturma
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0
  ].join('|');
  
  // Basit hash fonksiyonu
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer'a çevir
  }
  
  return Math.abs(hash).toString(16);
};

export const generateReferralCode = (userId: string): string => {
  // Kullanıcı ID'sinden referans kodu oluştur
  const timestamp = Date.now().toString();
  const combined = userId + timestamp;
  
  // Basit hash fonksiyonu
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer'a çevir
  }
  
  // 8 karakterlik referans kodu oluştur
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
  return code.padStart(8, '0');
};

export const calculateReferralBonus = (amount: number): number => {
  // Calculate 20% referral bonus
  return amount * 0.2;
};
