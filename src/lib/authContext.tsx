// src/lib/authContext.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// Specify types for user roles
export type UserRole = 'student' | 'admin' | 'coding' | 'hod' | 'superadmin' | 'stucor' | 'event';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getRoleFallback = (email: string | null): UserRole | null => {
  if (!email) return null;

  // Emergency fallback so you don't get locked out during migration
  if (email === 'shameelmohamed2005@gmail.com') return 'superadmin';

  // Pattern match: cse*@saranathan.ac.in
  const regex = /^cse.*@saranathan\.ac\.in$/;
  if (regex.test(email)) {
    return 'student';
  }

  return null; // Not authorized
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        let determinedRole: UserRole | null = null;
        let requiresUpdate = false;

        // Fetch role from userRoles collection keyed by email
        if (firebaseUser.email) {
          const roleDoc = await getDoc(doc(db, 'userRoles', firebaseUser.email));
          if (roleDoc.exists() && roleDoc.data().role) {
            determinedRole = roleDoc.data().role as UserRole;
          }
        }

        // Also check if we already saved their profile in users collection
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!determinedRole) {
          // New user or missing role, fallback to regex/seed
          determinedRole = getRoleFallback(firebaseUser.email);
        }

        if (userDoc.exists()) {
          // Update profile details if they changed
          if (userDoc.data().email !== firebaseUser.email || userDoc.data().photoURL !== firebaseUser.photoURL || userDoc.data().role !== determinedRole) {
             requiresUpdate = true;
          }
        } else {
          requiresUpdate = true;
        }

        if (determinedRole) {
          if (requiresUpdate) {
            await setDoc(userRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: determinedRole, 
            }, { merge: true });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: determinedRole,
          });
        } else {
          // Valid Google login, but NOT an authorized email.
          // Sign them out immediately, then redirect to the access-denied page.
          await signOut(auth);
          setUser(null);
          // Store the rejected email so the access-denied page can show it
          sessionStorage.setItem('denied_email', firebaseUser.email || '');
          window.location.replace('/access-denied');
          return;
        }
        // Set cookie for middleware
        document.cookie = `stucor_auth=true; path=/; max-age=2592000`; // 30 days
      } else {
        // Clear cookie
        document.cookie = `stucor_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // Silently ignore when the user manually closes the Google popup
        return;
      }
      console.error("Login error:", error);
      setError("An error occurred during Google Sign-In.");
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    // Always redirect to the login page (home) after sign-out
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};