"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { authClient } from "@/src/lib/auth-client";
// import { User } from "@/src/types/user";

export type User = {
  id: string;
  username: string | null;
  role: string;
  newField: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Session = {
  accessToken?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

let cachedUser: User | null = null;
let cachedSession: Session | null = null;
let lastFetchTime = 0;

const CACHE_DURATION = 5 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [session, setSession] = useState<Session | null>(cachedSession);
  const [loading, setLoading] = useState(true);

  

  const pendingPromiseRef = useRef<Promise<any> | null>(null);

  const fetchSession = useCallback(async (force = false) => {
    const now = Date.now();

    if (!force && cachedUser && now - lastFetchTime < CACHE_DURATION) {
      setUser(cachedUser);
      setSession(cachedSession);
      setLoading(false);
      return;
    }

    if (pendingPromiseRef.current) return;

    setLoading(true);
    pendingPromiseRef.current = authClient.getSession();

    try {
      const result = await pendingPromiseRef.current;
      const data = result?.data || result;

      cachedUser = data?.user || null;
      cachedSession = data?.session || null;
      lastFetchTime = now;

      setUser(cachedUser);
      setSession(cachedSession);
    } catch (err) {
      console.error(err);
      setUser(null);
      setSession(null);
    } finally {
      pendingPromiseRef.current = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

 
  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    refreshAuth: () => fetchSession(true),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};