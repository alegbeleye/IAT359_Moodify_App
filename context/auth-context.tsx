// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";

export type AppUser = { id: string; email: string } | null;

export type AuthContextValue = {
  user: AppUser;
  loading: boolean;
  signIn: (args: { email: string; password: string }) => Promise<void>;
  signUp: (args: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        email: result.user.email || "",
      });
    } catch (err: any) {
      throw new Error(err.message || "Sign in failed");
    }
  }

  async function signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser({
        id: result.user.uid,
        email: result.user.email || "",
      });
    } catch (err: any) {
      throw new Error(err.message || "Sign up failed");
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      throw new Error(err.message || "Sign out failed");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
