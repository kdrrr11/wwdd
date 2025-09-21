// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get, onValue, off } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { User } from '../types';

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
            }, (error) => {
              console.error('Error listening to user data:', error);
            });
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
          // Clean up user data listener when user logs out
          if (userDataUnsubscribe) {
            userDataUnsubscribe();
            userDataUnsubscribe = null;
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
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

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUserData
  };
};