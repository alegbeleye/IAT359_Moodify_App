import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../db/firebaseConfig";
import {
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOut as firebaseSignOut,
} from "../db/auth";

// https://reactnavigation.org/docs/typescript/
export type AppUser = { id: string; email: string; name?: string } | null;

export type AuthContextValue = {
  user: AppUser;
  loading: boolean;
  signIn: (args: { username: string; password: string }) => Promise<void>;
  signUp: (args: { name: string; username: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

// https://react.dev/reference/react/createContext
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

  // auth state pattern to listen for user changes: https://firebase.google.com/docs/auth/web/start
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      await firebaseSignIn(username, password);
    } catch (error: any) {
      // errors from firebase docs: https://firebase.google.com/docs/auth/admin/errors
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found for that email.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Invalid credentials.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address.");
      } else {
        throw new Error(error.message || "Sign in failed.");
      }
    }
  }

  async function signUp({
    name,
    username,
    password,
  }: {
    name: string;
    username: string;
    password: string;
  }) {
    try {
      await firebaseSignUp(username, password, name);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already taken.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters.");
      } else {
        throw new Error(error.message || "Sign up failed.");
      }
    }
  }

  async function signOut() {
    await firebaseSignOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};