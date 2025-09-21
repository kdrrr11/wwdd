import { useState, useEffect, useCallback } from 'react';
import { ref, set, get, onValue, push } from 'firebase/database';
import { database } from '../config/firebase';
import { MiningSession, Coin } from '../types';
import { useAuth } from './useAuth';

export const useMining = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState<MiningSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const coins: Coin[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', baseHashRate: 100, baseEarning: 0.0001, color: '#F7931A' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', baseHashRate: 500, baseEarning: 0.002, color: '#627EEA' },
    { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', icon: 'Ð', baseHashRate: 1000, baseEarning: 0.5, color: '#C2A633' },
    { id: 'ltc', name: 'Litecoin', symbol: 'LTC', icon: 'Ł', baseHashRate: 800, baseEarning: 0.01, color: '#BFBBBB' },
  ];

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

  const startMining = useCallback(async (coinId: string) => {
    if (!user || isLoading) return;

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
      if (!coin) return;

      // Calculate hash rate based on user's package or trial
      let hashRate = coin.baseHashRate;
      if (user.activePackage) {
        // Apply package multiplier (would be loaded from packages data)
        hashRate *= 2; // Example multiplier
      }

      const newSession: Omit<MiningSession, 'id'> = {
        userId: user.uid,
        coin: coinId,
        startTime: new Date().toISOString(),
        hashRate,
        totalEarned: 0,
        isActive: true,
        packageId: user.activePackage
      };

      const sessionsRef = ref(database, `miningSessions/${user.uid}`);
      await push(sessionsRef, newSession);

    } catch (error) {
      console.error('Error starting mining:', error);
    }
    setIsLoading(false);
  }, [user, activeSessions, isLoading]);

  const stopMining = useCallback(async (sessionId: string) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const session = activeSessions.find(s => s.id === sessionId);
      if (!session) return;

      await set(ref(database, `miningSessions/${user.uid}/${sessionId}`), {
        ...session,
        isActive: false,
        endTime: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error stopping mining:', error);
    }
    setIsLoading(false);
  }, [user, activeSessions, isLoading]);

  return {
    coins,
    activeSessions,
    isLoading,
    startMining,
    stopMining
  };
};