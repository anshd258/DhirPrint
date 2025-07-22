
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userProfile = userSnap.data() as UserProfile;
          setCurrentUser(userProfile);
          setIsAdmin(userProfile.role === 'admin');
        } else {
          // This case might happen if user record creation failed or is pending
          // For now, we'll set a basic profile, onUserCreate CF should handle full creation
          const newUserProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user',
            createdAt: new Date(), // Approximate, serverTimestamp is better
          };
          setCurrentUser(newUserProfile);
          setIsAdmin(false);
          // Consider creating the user doc here if onUserCreate is not guaranteed
          // await setDoc(userRef, { ...newUserProfile, createdAt: serverTimestamp() });
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const createUserProfileDocument = async (user: FirebaseUser, additionalData?: { displayName?: string }) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { email, photoURL } = user;
      const displayName = additionalData?.displayName || user.displayName;
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email,
          displayName,
          photoURL,
          role: 'user', // Default role
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error creating user document:", error);
        // Handle error appropriately
      }
    }
  };
  
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      const result = await signInWithPopup(auth, provider);
      signInWithPopup(auth, provider)
  .then(async(result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    await createUserProfileDocument(result.user);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Google sign-in error:", error);
  });

      
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Handle error (e.g., show toast)
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email/password sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signupWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await createUserProfileDocument(result.user, { displayName });
      }
    } catch (error) {
      console.error("Email/password sign-up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      // State update will be handled by onAuthStateChanged
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
