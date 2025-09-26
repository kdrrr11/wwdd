// src/utils/miningCalculations.ts
export interface MiningCalculation {
  hashRateMultiplier: number;
  earningMultiplier: number;
  dailyEarningBonus: number;
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
  if (elapsedHours > 24) {
    elapsedHours = 24;
  }
  
  const multipliers = getPackageMultipliers(packageId);
  const hashRateRatio = hashRate / baseHashRate;
  
  // Maksimum multiplier kontrolü
  const maxMultiplier = packageId ? 10 : 1; // Premium paketler için max 10x, trial için 1x
  const effectiveMultiplier = Math.min(multipliers.earningMultiplier, maxMultiplier);
  
  const hourlyEarning = baseEarning * hashRateRatio * effectiveMultiplier;
  
  // Sonuç kontrolü
  const result = hourlyEarning * elapsedHours;
  
  // Makul olmayan kazanç kontrolü
  const maxReasonableEarning = baseEarning * 10 * elapsedHours;
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

export const canUserMine = (user: any): boolean => {
  if (!user) return false;
  
  // Ban kontrolü
  if (user.isBanned) return false;
  
  // Check if user has active package
  if (user.activePackage) return true;
  
  // Check trial status
  const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null;
  const now = new Date();
  const trialActive = trialEndDate && now < trialEndDate;
  const earningsWithinLimit = user.totalTrialEarnings < 25;
  
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

}