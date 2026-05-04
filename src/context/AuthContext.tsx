'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { syncOnSignIn } from '@/utils/stats';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'wordle-token';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthValue {
  user: AuthUser | null;
  token: string | null;
  googleSignIn: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${stored}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(({ user: u }: { user: AuthUser }) => { setToken(stored); setUser(u); })
      .catch(() => localStorage.removeItem(TOKEN_KEY));
  }, []);

  async function googleSignIn(credential: string) {
    const r = await fetch(`${API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ?? 'Sign in failed');
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    syncOnSignIn(data.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, googleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
