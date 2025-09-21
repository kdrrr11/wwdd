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

  const coins: Coin[] = [
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: '₿', 
      baseHashRate: 1000, 
      baseEarning: 0.001, 
      color: '#F7931A' 
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: 'Ξ', 
      baseHashRate: 2500, 
      baseEarning: 0.003, 
      color: '#627EEA' 
    },
    { 
      id: 'doge', 
      name: 'Dogecoin', 
      symbol: 'DOGE', 
      icon: 'Ð', 
      baseHashRate: 5000, 
      baseEarning: 0.8, 
      color: '#C2A633' 
    },
    { 
      id: 'ltc', 
      name: 'Litecoin', 
      symbol: 'LTC', 
      icon: 'Ł', 
      baseHashRate: 3000, 
      baseEarning: 0.015, 
      color: '#BFBBBB' 
    },
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
        setActiveSessions(sessions.filter(s => s.isActive));
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
      return;
    }

    const updateEarnings = async () => {
      const activeSession = activeSessions[0]; // Only one session can be active
      if (!activeSession) return;

      const coin = coins.find(c => c.id === activeSession.coin);
      if (!coin) return;

      const now = new Date().getTime();
      const start = new Date(activeSession.startTime).getTime();
      const elapsedHours = (now - start) / (1000 * 60 * 60);

      const totalEarnings = calculateMiningEarnings(
        coin.baseEarning,
        activeSession.hashRate,
        coin.baseHashRate,
        elapsedHours,
        user.activePackage
      );

      // Check trial limits for free users
      if (!user.activePackage) {
        const newTrialEarnings = user.totalTrialEarnings + totalEarnings - activeSession.totalEarned;
        if (newTrialEarnings >= 25) {
          // Stop mining when trial limit reached
          await stopMining(activeSession.id);
          toast.error('Trial earning limit reached! Please upgrade to continue mining.');
          return;
        }
      }

      // Update session earnings
      const sessionRef = ref(database, `miningSessions/${user.uid}/${activeSession.id}`);
      await update(sessionRef, {
        totalEarned: totalEarnings,
        lastUpdated: new Date().toISOString()
      });

      // Update user balance and trial earnings
      const earningsDifference = totalEarnings - activeSession.totalEarned;
      if (earningsDifference > 0) {
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
    };

    // Update earnings every 10 seconds
    earningsIntervalRef.current = setInterval(updateEarnings, 10000);

    return () => {
      if (earningsIntervalRef.current) {
        clearInterval(earningsIntervalRef.current);
        earningsIntervalRef.current = null;
      }
    };
  }, [user, activeSessions]);

  const startMining = useCallback(async (coinId: string) => {
    if (!user || isLoading) return;

    if (!canUserMine(user)) {
      toast.error('Mining not available. Please check your trial status or upgrade your package.');
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

      const newSession: Omit<MiningSession, 'id'> = {
        userId: user.uid,
        coin: coinId,
        startTime: new Date().toISOString(),
        hashRate,
        totalEarned: 0,
        isActive: true,
        packageId: user.activePackage,
        lastUpdated: new Date().toISOString()
      };

      const sessionsRef = ref(database, `miningSessions/${user.uid}`);
      await push(sessionsRef, newSession);
      
      toast.success(`${coin.name} mining started successfully!`);

    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining');
    }
    setIsLoading(false);
  }, [user, activeSessions, isLoading]);

  const stopMining = useCallback(async (sessionId: string) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const session = activeSessions.find(s => s.id === sessionId);
      if (!session) {
        toast.error('Mining session not found');
        return;
      }

      const coin = coins.find(c => c.id === session.coin);
      
      await set(ref(database, `miningSessions/${user.uid}/${sessionId}`), {
        ...session,
        isActive: false,
        endTime: new Date().toISOString()
      });

      toast.success(`${coin?.name || 'Mining'} stopped successfully!`);

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