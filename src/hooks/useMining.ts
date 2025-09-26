// src/hooks/useMining.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, set, get, onValue, push, update } from 'firebase/database';
import { database } from '../config/firebase';
import { MiningSession, Coin } from '../types';
import { useAuth } from './useAuth';
import { calculateMiningEarnings, calculateHashRate, canUserMine } from '../utils/miningCalculations';
import toast from 'react-hot-toast';

export const useMining = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState<MiningSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const earningsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const sessionStartRef = useRef<{ [key: string]: number }>({});

  const coins: Coin[] = [
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: '₿', 
      baseHashRate: 1000, 
      baseEarning: 0.0092, // 90 günde $25 = günlük $0.278 / 30 saat = saatlik $0.0092
      color: '#F7931A',
      description: 'The first and most valuable cryptocurrency',
      marketCap: '$1.2T',
      dailyVolume: '$15B'
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: 'Ξ', 
      baseHashRate: 1000, 
      baseEarning: 0.0092, 
      color: '#627EEA',
      description: 'Smart contract platform and DeFi leader',
      marketCap: '$400B',
      dailyVolume: '$8B'
    },
    { 
      id: 'doge', 
      name: 'Dogecoin', 
      symbol: 'DOGE', 
      icon: 'Ð', 
      baseHashRate: 1000, 
      baseEarning: 0.0092, 
      color: '#C2A633',
      description: 'The meme coin that became mainstream',
      marketCap: '$25B',
      dailyVolume: '$800M'
    },
    { 
      id: 'ltc', 
      name: 'Litecoin', 
      symbol: 'LTC', 
      icon: 'Ł', 
      baseHashRate: 1000, 
      baseEarning: 0.0092, 
      color: '#BFBBBB',
      description: 'Digital silver to Bitcoin\'s gold',
      marketCap: '$8B',
      dailyVolume: '$400M'
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADA',
      icon: '₳',
      baseHashRate: 1000,
      baseEarning: 0.0092,
      color: '#0033AD',
      description: 'Sustainable blockchain platform',
      marketCap: '$15B',
      dailyVolume: '$300M'
    },
    {
      id: 'dot',
      name: 'Polkadot',
      symbol: 'DOT',
      icon: '●',
      baseHashRate: 1000,
      baseEarning: 0.0092,
      color: '#E6007A',
      description: 'Multi-chain interoperability protocol',
      marketCap: '$12B',
      dailyVolume: '$250M'
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      icon: '◎',
      baseHashRate: 1000,
      baseEarning: 0.0092,
      color: '#9945FF',
      description: 'High-performance blockchain',
      marketCap: '$45B',
      dailyVolume: '$1.2B'
    },
    {
      id: 'matic',
      name: 'Polygon',
      symbol: 'MATIC',
      icon: '⬟',
      baseHashRate: 1000,
      baseEarning: 0.0092,
      color: '#8247E5',
      description: 'Ethereum scaling solution',
      marketCap: '$8B',
      dailyVolume: '$200M'
    }
  ];

  // Load mining sessions
  useEffect(() => {
    if (!user) return;

    const sessionsRef = ref(database, `miningSessions/${user.uid}`);
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessions = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        const activeSessions = sessions.filter(s => s.isActive);
        
        // Güvenlik kontrolü: Aynı anda birden fazla aktif session varsa hepsini durdur
        if (activeSessions.length > 1) {
          console.warn('Multiple active sessions detected, stopping all');
          activeSessions.forEach(session => {
            set(ref(database, `miningSessions/${user.uid}/${session.id}`), {
              ...session,
              isActive: false,
              endTime: new Date().toISOString()
            });
          });
          setActiveSessions([]);
          toast.error('Güvenlik nedeniyle tüm mining oturumları durduruldu');
          return;
        }
        
        // Session başlangıç zamanlarını kaydet
        activeSessions.forEach(session => {
          if (!sessionStartRef.current[session.id]) {
            sessionStartRef.current[session.id] = new Date(session.startTime).getTime();
          }
        });
        
        setActiveSessions(activeSessions);
      } else {
        setActiveSessions([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Update earnings for active sessions
  useEffect(() => {
    if (!user || activeSessions.length === 0) {
      if (earningsIntervalRef.current) {
        clearInterval(earningsIntervalRef.current);
        earningsIntervalRef.current = null;
      }
      lastUpdateRef.current = 0;
      return;
    }

    const updateEarnings = async () => {
      const activeSession = activeSessions[0]; // Only one session can be active
      if (!activeSession) return;

      const now = Date.now();
      
      // Güvenlik kontrolü: Çok sık güncelleme yapılmasını engelle (minimum 5 saniye)
      if (lastUpdateRef.current > 0 && (now - lastUpdateRef.current) < 5000) {
        return;
      }
      
      // Güvenlik kontrolü: Session başlangıç zamanı kontrolü
      const sessionStart = sessionStartRef.current[activeSession.id];
      const dbSessionStart = new Date(activeSession.startTime).getTime();
      
      if (sessionStart && Math.abs(sessionStart - dbSessionStart) > 60000) { // 1 dakika tolerans
        console.warn('Session start time mismatch detected');
        await stopMining(activeSession.id);
        toast.error('Güvenlik nedeniyle mining durduruldu');
        return;
      }

      // Check if package has expired
      if (user.activePackage && user.packageExpiresAt) {
        const packageExpiry = new Date(user.packageExpiresAt);
        if (now > packageExpiry.getTime()) {
          console.log('Package expired, stopping mining');
          await stopMining(activeSession.id, 'Package expired');
          // toast.error('Paket süresi doldu, madencilik durduruldu'); // Remove to prevent spam
          return;
        }
      }

      const coin = coins.find(c => c.id === activeSession.coin);
      if (!coin) return;

      const start = new Date(activeSession.startTime).getTime();
      const elapsedHours = (now - start) / (1000 * 60 * 60);
      
      // Güvenlik kontrolü: Makul olmayan süre kontrolü (maksimum 24 saat)
      if (elapsedHours > 24) {
        console.warn('Mining session exceeded maximum duration');
        await stopMining(activeSession.id);
        toast.error('Mining oturumu maksimum süreyi aştı');
        return;
      }
      
      // Güvenlik kontrolü: Negatif zaman kontrolü
      if (elapsedHours < 0) {
        console.warn('Negative elapsed time detected');
        await stopMining(activeSession.id);
        toast.error('Geçersiz zaman tespit edildi');
        return;
      }

      const totalEarnings = calculateMiningEarnings(
        coin.baseEarning,
        activeSession.hashRate,
        coin.baseHashRate,
        elapsedHours,
        user.activePackage
      );
      
      // Güvenlik kontrolü: Makul olmayan kazanç kontrolü
      const maxPossibleEarning = coin.baseEarning * 10 * elapsedHours; // 10x maksimum multiplier
      if (totalEarnings > maxPossibleEarning) {
        console.warn('Unrealistic earnings detected');
        await stopMining(activeSession.id);
        toast.error('Anormal kazanç tespit edildi');
        return;
      }
      
      // Güvenlik kontrolü: Önceki kazançtan düşük olamaz
      if (totalEarnings < activeSession.totalEarned) {
        console.warn('Earnings decreased, possible manipulation');
        return;
      }

      // Check trial limits for free users
      if (!user.activePackage) {
        const newTrialEarnings = user.totalTrialEarnings + totalEarnings - activeSession.totalEarned;
        if (newTrialEarnings >= 25) {
          // Stop mining when trial limit reached
          await stopMining(activeSession.id, 'Trial limit reached');
          toast.error('Trial earning limit reached! Please upgrade to continue mining.');
          return;
        }
        
        // Check trial time limit (90 days)
        if (user.trialEndDate) {
          const trialEnd = new Date(user.trialEndDate);
          if (now > trialEnd.getTime()) {
            await stopMining(activeSession.id, 'Trial period expired');
            toast.error('Trial period expired! Please upgrade to continue mining.');
            return;
          }
        }
      }

      // Update session earnings
      const sessionRef = ref(database, `miningSessions/${user.uid}/${activeSession.id}`);
      await update(sessionRef, {
        totalEarned: totalEarnings,
        lastUpdated: new Date().toISOString(),
        lastServerUpdate: now // Server timestamp for validation
      });

      // Update user balance and trial earnings
      const earningsDifference = totalEarnings - activeSession.totalEarned;
      if (earningsDifference > 0) {
        // Güvenlik kontrolü: Çok büyük kazanç artışı kontrolü
        const maxIncrease = coin.baseEarning * 0.5; // 30 saniyede maksimum artış
        if (earningsDifference > maxIncrease) {
          console.warn('Earnings increase too large');
          return;
        }
        
        const userRef = ref(database, `users/${user.uid}`);
        const updates: any = {
          balance: user.balance + earningsDifference
        };

        // Update trial earnings if no active package
        if (!user.activePackage) {
          updates.totalTrialEarnings = user.totalTrialEarnings + earningsDifference;
        }

        await update(userRef, updates);
      }
      
      lastUpdateRef.current = now;
    };

    // Update earnings every 30 seconds (güvenlik için daha az sıklık)
    earningsIntervalRef.current = setInterval(updateEarnings, 30000);

    return () => {
      if (earningsIntervalRef.current) {
        clearInterval(earningsIntervalRef.current);
        earningsIntervalRef.current = null;
      }
    };
  }, [user, activeSessions]);

  const startMining = useCallback(async (coinId: string) => {
    if (!user || isLoading) return;

    // Ban kontrolü
    if (user.isBanned) {
      toast.error(`Hesabınız banlanmıştır. Sebep: ${user.banReason || 'Güvenlik ihlali'}`);
      return;
    }

    if (!canUserMine(user)) {
      toast.error('Mining not available. Please check your trial status or upgrade your package.');
      return;
    }
    
    // Güvenlik kontrolü: Çok sık başlatma engelleme
    const now = Date.now();
    if (lastUpdateRef.current > 0 && (now - lastUpdateRef.current) < 10000) {
      toast.error('Lütfen 10 saniye bekleyin');
      return;
    }

    setIsLoading(true);
    try {
      // Stop all other active mining sessions
      const stopPromises = activeSessions.map(session => 
        set(ref(database, `miningSessions/${user.uid}/${session.id}`), {
          ...session,
          isActive: false,
          endTime: new Date().toISOString()
        })
      );
      await Promise.all(stopPromises);

      const coin = coins.find(c => c.id === coinId);
      if (!coin) {
        toast.error('Invalid coin selected');
        return;
      }

      // Calculate hash rate based on package
      const hashRate = calculateHashRate(coin.baseHashRate, user.activePackage);

      // Create new session with proper packageId handling
      const newSession: Omit<MiningSession, 'id'> = {
        userId: user.uid,
        coin: coinId,
        startTime: new Date().toISOString(),
        hashRate,
        totalEarned: 0,
        isActive: true,
        // Sadece activePackage varsa packageId ekle, yoksa hiç ekleme
        ...(user.activePackage && { packageId: user.activePackage }),
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(), // Güvenlik için oluşturulma zamanı
        userAgent: navigator.userAgent.substring(0, 100) // Güvenlik için user agent
      };

      const sessionsRef = ref(database, `miningSessions/${user.uid}`);
      const newSessionRef = await push(sessionsRef, newSession);
      
      // Session ID'yi kaydet
      if (newSessionRef.key) {
        sessionStartRef.current[newSessionRef.key] = now;
      }
      
      toast.success(`${coin.name} mining started successfully!`);
      lastUpdateRef.current = now;

    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining');
    }
    setIsLoading(false);
  }, [user, activeSessions, isLoading]);

  const stopMining = useCallback(async (sessionId: string, reason?: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const session = activeSessions.find(s => s.id === sessionId);
      if (!session) {
        setIsLoading(false);
        toast.error('Mining session not found');
        return;
      }

      const coin = coins.find(c => c.id === session.coin);
      
      await set(ref(database, `miningSessions/${user.uid}/${sessionId}`), {
        ...session,
        isActive: false,
        endTime: new Date().toISOString(),
        autoStopped: !!reason,
        stopReason: reason
      });
      
      // Session referansını temizle
      delete sessionStartRef.current[sessionId];

      if (!reason) {
        toast.success(`${coin?.name || 'Mining'} stopped successfully!`);
      }

    } catch (error) {
      console.error('Error stopping mining:', error);
      toast.error('Failed to stop mining');
    }
    setIsLoading(false);
  }, [user, activeSessions, isLoading]);

  return {
    coins,
    activeSessions,
    isLoading,
    startMining,
    stopMining,
    canMine: canUserMine(user)
  };
};