// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get, onValue } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Listen to real-time user data updates
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        
        // Check if user exists
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          // Set up real-time listener for user data
          const userDataUnsubscribe = onValue(userRef, (userSnapshot) => {
            if (userSnapshot.exists()) {
              setUser(userSnapshot.val());
            }
          });
          
          // Store the unsubscribe function for cleanup
          (window as any).userDataUnsubscribe = userDataUnsubscribe;
        } else {
          // Create new user profile
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            createdAt: new Date().toISOString(),
            trialStartDate: new Date().toISOString(),
            trialEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
            totalTrialEarnings: 0,
            balance: 0,
            isAdmin: false
          };
          
          await set(userRef, newUser);
          setUser(newUser);
          
          // Set up real-time listener for the new user
          const userDataUnsubscribe = onValue(userRef, (userSnapshot) => {
            if (userSnapshot.exists()) {
              setUser(userSnapshot.val());
            }
          });
          
          (window as any).userDataUnsubscribe = userDataUnsubscribe;
        }
      } else {
        // Clean up user data listener when user logs out
        if ((window as any).userDataUnsubscribe) {
          (window as any).userDataUnsubscribe();
          (window as any).userDataUnsubscribe = null;
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      // Clean up user data listener
      if ((window as any).userDataUnsubscribe) {
        (window as any).userDataUnsubscribe();
        (window as any).userDataUnsubscribe = null;
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
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
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string) => {
    try {
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
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Clean up user data listener before logout
      if ((window as any).userDataUnsubscribe) {
        (window as any).userDataUnsubscribe();
        (window as any).userDataUnsubscribe = null;
      }
      
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  };

  // Helper function to update user data
  const updateUserData = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, { ...user, ...updates });
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw new Error('Failed to update user data');
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUserData
  };
};