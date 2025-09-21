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
  const multipliers = getPackageMultipliers(packageId);
  const hashRateRatio = hashRate / baseHashRate;
  const hourlyEarning = baseEarning * hashRateRatio * multipliers.earningMultiplier;
  return hourlyEarning * elapsedHours;
};

export const calculateHashRate = (baseHashRate: number, packageId?: string): number => {
  const multipliers = getPackageMultipliers(packageId);
  return Math.floor(baseHashRate * multipliers.hashRateMultiplier);
};

export const canUserMine = (user: any): boolean => {
  if (!user) return false;
  
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
  if (hashRate >= 1000000) {
    return `${(hashRate / 1000000).toFixed(1)}MH/s`;
  } else if (hashRate >= 1000) {
    return `${(hashRate / 1000).toFixed(1)}KH/s`;
  }
  return `${hashRate}H/s`;
};