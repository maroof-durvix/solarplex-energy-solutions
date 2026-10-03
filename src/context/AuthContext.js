'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup 
} from 'firebase/auth';

const AuthContext = createContext();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let auth = null;
if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase Auth initialization failed:", error);
  }
}

// Default credentials mapping email to role and details for mock mode
const MOCK_ACCOUNTS = {
  'admin@solarplex.com': { uid: 'mock_admin', email: 'admin@solarplex.com', role: 'admin', name: 'Zeeshan Khan' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Auth Changes
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // If we had a real database, we would query firestore for user role.
          // For this hybrid project, we map domain/email prefixes, or defaults.
          let userRole = 'customer';
          if (firebaseUser.email === 'admin@solarplex.com') userRole = 'admin';
          else if (firebaseUser.email.endsWith('@solarplex.com')) userRole = 'staff';
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
          });
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock auth loader from localStorage
      const savedSession = localStorage.getItem('solarplex_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setUser({ uid: parsed.uid, email: parsed.email, name: parsed.name });
          setRole(parsed.role);
        } catch (e) {
          localStorage.removeItem('solarplex_session');
        }
      }
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    if (auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: credential.user };
      } catch (err) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    } else {
      // Local mock login checking
      const formattedEmail = email.toLowerCase().trim();
      
      // Allow dynamic registered users (customers, staff, or admin) to login
      const users = JSON.parse(localStorage.getItem('solarplex_registered_users') || '[]');
      const found = users.find(u => u.email === formattedEmail && u.password === password);
      if (found) {
        const sessionUser = {
          uid: found.uid,
          email: found.email,
          name: found.name,
          role: found.role || 'customer'
        };
        setUser({ uid: sessionUser.uid, email: sessionUser.email, name: sessionUser.name });
        setRole(sessionUser.role);
        localStorage.setItem('solarplex_session', JSON.stringify(sessionUser));
        setLoading(false);
        return { success: true };
      }

      // Check MOCK_ACCOUNTS fallback if not registered yet
      const account = MOCK_ACCOUNTS[formattedEmail];
      if (account && password === (account.role + '123')) {
        const sessionUser = {
          uid: account.uid,
          email: account.email,
          name: account.name,
          role: account.role
        };
        setUser({ uid: sessionUser.uid, email: sessionUser.email, name: sessionUser.name });
        setRole(sessionUser.role);
        localStorage.setItem('solarplex_session', JSON.stringify(sessionUser));
        setLoading(false);
        return { success: true };
      }
      
      setLoading(false);
      return { 
        success: false, 
        error: "Invalid email or password. Please verify your credentials or sign up." 
      };
    }
  };

  // Register dynamic customer/staff/admin accounts
  const register = async (email, password, name) => {
    setLoading(true);
    if (auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // For real auth we can set user displayName
        return { success: true, user: credential.user };
      } catch (err) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    } else {
      const formattedEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem('solarplex_registered_users') || '[]');
      
      if (users.some(u => u.email === formattedEmail)) {
        setLoading(false);
        return { success: false, error: "This email address is already registered." };
      }

      let userRole = 'customer';
      if (formattedEmail === 'admin@solarplex.com') userRole = 'admin';
      else if (formattedEmail.endsWith('@solarplex.com')) userRole = 'staff';

      const newUser = {
        uid: `user_${Date.now()}`,
        email: formattedEmail,
        password: password,
        name: name,
        role: userRole
      };
      
      users.push(newUser);
      localStorage.setItem('solarplex_registered_users', JSON.stringify(users));
      
      // Auto login
      setUser({ uid: newUser.uid, email: newUser.email, name: newUser.name });
      setRole(userRole);
      localStorage.setItem('solarplex_session', JSON.stringify(newUser));
      setLoading(false);
      return { success: true };
    }
  };

  // Login with Google (Firebase or Mock)
  const loginWithGoogle = async () => {
    setLoading(true);
    if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        return { success: true, user: credential.user };
      } catch (err) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    } else {
      const mockUser = {
        uid: 'mock_google_user',
        email: 'kafeel.ahmed@gmail.com',
        name: 'Kafeel Ahmed Khan',
        role: 'customer'
      };
      setUser({ uid: mockUser.uid, email: mockUser.email, name: mockUser.name });
      setRole(mockUser.role);
      localStorage.setItem('solarplex_session', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    }
  };

  // Login with Apple (Firebase or Mock)
  const loginWithApple = async () => {
    setLoading(true);
    if (auth) {
      try {
        const provider = new OAuthProvider('apple.com');
        const credential = await signInWithPopup(auth, provider);
        return { success: true, user: credential.user };
      } catch (err) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    } else {
      const mockUser = {
        uid: 'mock_apple_user',
        email: 'kafeel.ahmed@icloud.com',
        name: 'Kafeel Ahmed Khan (Apple)',
        role: 'customer'
      };
      setUser({ uid: mockUser.uid, email: mockUser.email, name: mockUser.name });
      setRole(mockUser.role);
      localStorage.setItem('solarplex_session', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    if (auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('solarplex_session');
    }
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, loginWithGoogle, loginWithApple }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
