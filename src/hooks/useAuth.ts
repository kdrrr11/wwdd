// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set, get, onValue, update } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { User } from '../types';
import { generateReferralCode, generateDeviceFingerprint } from '../utils/miningCalculations';
import { detectUserLanguage } from '../utils/languages';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDataUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          
          // Check if user exists
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            // Set up real-time listener for user data
            userDataUnsubscribe = onValue(userRef, (userSnapshot) => {
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                setUser(userData);
              } else {
                console.warn('User data not found in database');
                setUser(null);
              }
              setLoading(false);
            }, (error) => {
              console.error('Error listening to user data:', error);
              setLoading(false);
            });
          } else {
            // Create new user profile
            const deviceFingerprint = await generateDeviceFingerprint();
            const referralCode = generateReferralCode(firebaseUser.uid);
            
            // URL'den referans kodunu kontrol et
            const urlParams = new URLSearchParams(window.location.search);
            const referralParam = urlParams.get('ref');
            let referredBy = undefined;
            
            if (referralParam) {
              // Referans kodunu kontrol et
              const usersRef = ref(database, 'users');
              const usersSnapshot = await get(usersRef);
              if (usersSnapshot.exists()) {
                const users = usersSnapshot.val();
                const referrer = Object.values(users).find((u: any) => u.referralCode === referralParam);
                if (referrer) {
                  referredBy = (referrer as any).uid;
                  
                  // Referans veren kullanıcının referans sayısını artır
                  const referrerRef = ref(database, `users/${(referrer as any).uid}`);
                  const referrerData = referrer as any;
                  await set(referrerRef, {
                    ...referrerData,
                    totalReferrals: (referrerData.totalReferrals || 0) + 1
                  });
                }
              }
            }
            
            // Kullanıcı dilini ve ülkesini tespit et
            const userLanguage = detectUserLanguage();
            const userCountry = await getUserCountry();
            
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              createdAt: new Date().toISOString(),
              trialStartDate: new Date().toISOString(),
              trialEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
              totalTrialEarnings: 0,
              balance: 0,
              isAdmin: false,
              referralCode,
              ...(referredBy && { referredBy }),
              referralEarnings: 0,
              totalReferrals: 0,
              isBanned: false,
              deviceFingerprint: deviceFingerprint,
              language: userLanguage,
              lastLoginIP: await getUserIP(),
              country: userCountry
            };
            
            await set(userRef, newUser);
            setUser(newUser);
            setLoading(false);
            
            // Güvenlik logu
            await logSecurityEvent(firebaseUser.uid, 'ACCOUNT_CREATED', deviceFingerprint);
            
            // Set up real-time listener for the new user
            userDataUnsubscribe = onValue(userRef, (userSnapshot) => {
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                setUser(userData);
              }
            }, (error) => {
              console.error('Error listening to user data:', error);
            });
          }
        } else {
          // Çıkış logu
          if (user) {
            try {
              await logSecurityEvent(user.uid, 'LOGOUT', user.deviceFingerprint || '');
            } catch (error) {
              console.error('Error logging logout:', error);
            }
          }
          
          // Clean up user data listener when user logs out
          if (userDataUnsubscribe) {
            userDataUnsubscribe();
            userDataUnsubscribe = null;
          }
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      // Clean up user data listener
      if (userDataUnsubscribe) {
        userDataUnsubscribe();
      }
    };
  }, [user?.uid]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Giriş güvenlik kontrolü
      if (result.user) {
        const deviceFingerprint = await generateDeviceFingerprint();
        const userIP = await getUserIP();
        
        // Kullanıcı bilgilerini güncelle
        const userRef = ref(database, `users/${result.user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          await set(userRef, {
            ...userData,
            lastLoginIP: userIP,
            deviceFingerprint
          });
        }
        
        // Güvenlik logu
        try {
          await logSecurityEvent(result.user.uid, 'LOGIN', deviceFingerprint);
        } catch (error) {
          console.error('Error logging login:', error);
        }
        
        // Şüpheli aktivite kontrolü
        try {
          await checkSuspiciousActivity(result.user.uid, userIP, deviceFingerprint);
        } catch (error) {
          console.error('Error checking suspicious activity:', error);
        }
      }
      
      return result;
    } catch (error: any) {
      // Handle specific Firebase auth errors
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }
      
      console.error('Login error:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error: any) {
      // Handle specific Firebase auth errors
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        default:
          errorMessage = error.message || 'Registration failed';
      }
      
      console.error('Registration error:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Password reset failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        default:
          errorMessage = error.message || 'Password reset failed';
      }
      
      console.error('Password reset error:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update user language
  const updateUserLanguage = async (language: string) => {
    if (!user) return;
    
    try {
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, { language });
    } catch (error) {
      console.error('Failed to update user language:', error);
      throw new Error('Failed to update language preference');
    }
  };

  // Helper function to update user data
  const updateUserData = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const updatedData = { ...user, ...updates };
      await set(userRef, updatedData);
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw new Error('Failed to update user data');
    }
  };

  // IP adresi alma
  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  // Kullanıcı ülkesi alma
  const getUserCountry = async (): Promise<string> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  };

  // Güvenlik olayı loglama
  const logSecurityEvent = async (userId: string, action: string, deviceFingerprint: string) => {
    try {
      const userIP = await getUserIP();
      const securityLog = {
        userId,
        action,
        ipAddress: userIP,
        deviceFingerprint,
        timestamp: new Date().toISOString(),
        suspicious: false
      };
      
      const logsRef = ref(database, `securityLogs/${Date.now()}_${userId}`);
      await set(logsRef, securityLog);
    } catch (error) {
      console.error('Security logging failed:', error);
    }
  };

  // Şüpheli aktivite kontrolü
  const checkSuspiciousActivity = async (userId: string, ip: string, fingerprint: string) => {
    try {
      const logsRef = ref(database, 'securityLogs');
      const snapshot = await get(logsRef);
      
      if (snapshot.exists()) {
        const logs = Object.values(snapshot.val()) as any[];
        const recentLogs = logs.filter(log => 
          new Date(log.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
        );
        
        // Aynı IP'den çok fazla hesap kontrolü
        const sameIPAccounts = recentLogs.filter(log => 
          log.ipAddress === ip && log.userId !== userId
        );
        
        if (sameIPAccounts.length > 3) {
          // Şüpheli aktivite tespit edildi
          await banUser(userId, 'Multiple accounts from same IP detected');
        }
      }
    } catch (error) {
      console.error('Suspicious activity check failed:', error);
    }
  };

  // Kullanıcı banlama
  const banUser = async (userId: string, reason: string) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        await set(userRef, {
          ...userData,
          isBanned: true,
          banReason: reason,
          bannedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Ban user failed:', error);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    resetPassword,
    logout,
    updateUserData,
    updateUserLanguage
  };
};
