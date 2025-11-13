// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import {
  initDB,
  createUser,
  findUserByUsername,
  setSession,
  clearSession,
  getSessionUserId,
  findUserById,
  UserRow,
} from "../db/sqlite";

export type AppUser = { id: number; username: string } | null;

export type AuthContextValue = {
  user: AppUser;
  loading: boolean;
  signIn: (args: { username: string; password: string }) => Promise<void>;
  signUp: (args: { username: string; password: string }) => Promise<void>;
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
    (async () => {
      try {
        await initDB();
        const sessionUserId = await getSessionUserId();
        if (sessionUserId) {
          const u = await findUserById(sessionUserId);
          if (u) setUser({ id: u.id, username: u.username });
        }
      } catch (err) {
        console.warn("Auth init error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function hashPassword(password: string): Promise<string> {
    // we are thinking of using another form of hashing but this works locally for now
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return digest;
  }

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const normalized = String(username).trim().toLowerCase();
    const userRow = await findUserByUsername(normalized);
    if (!userRow) {
      throw new Error("No account found for that username.");
    }
    const hash = await hashPassword(password);
    if (hash !== userRow.password_hash) {
      throw new Error("Invalid credentials.");
    }
    await setSession(userRow.id);
    setUser({ id: userRow.id, username: userRow.username });
  }

  async function signUp({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const normalized = String(username).trim().toLowerCase();
    const existing = await findUserByUsername(normalized);
    if (existing) throw new Error("Username already taken.");
    const hash = await hashPassword(password);
    const id = await createUser({ username: normalized, passwordHash: hash });
    await setSession(id);
    setUser({ id, username: normalized });
  }

  async function signOut() {
    await clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
