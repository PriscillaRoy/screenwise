// src/context/AuthContext.tsx
// JWT state for the entire app.
// Wrap the root layout with <AuthProvider> — all pages and components
// call useAuth() to get the current user and auth actions.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { auth, getToken, setToken, clearToken, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

// ── Context shape ──────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  loading: boolean;             // true during initial token validation on mount
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<string>; // returns message
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: validate any existing token with /auth/me.
  // If valid → hydrate user state (no re-login needed on refresh).
  // If invalid/expired → clear it silently.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    auth
      .me()
      .then(setUser)
      .catch((err) => {
        // 401 = token expired or invalid — clear it
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
        }
        // Any other error: network down etc — don't clear token, just fail silently
      })
      .finally(() => setLoading(false));
  }, []);

  const signin = useCallback(async (email: string, password: string) => {
    const res = await auth.signin(email, password);
    setToken(res.access_token);
    // Fetch full user object — AuthResponse has user_id + email but
    // /auth/me is the canonical user shape; keep them consistent.
    const me = await auth.me();
    setUser(me);
  }, []);

  const signup = useCallback(
    async (email: string, password: string): Promise<string> => {
      const res = await auth.signup(email, password);
      // Supabase requires email confirmation by default.
      // If auto-confirm is on (as in our dev setup), user can sign in immediately.
      // Return the message so the AuthForm can display it.
      return res.message;
    },
    []
  );

  const signout = useCallback(async () => {
    try {
      await auth.signout();
    } finally {
      // Always clear local state even if the server call fails.
      clearToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider>");
  }
  return ctx;
}
