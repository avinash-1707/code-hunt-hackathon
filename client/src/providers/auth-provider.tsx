"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  hydrateAccessToken,
  login,
  logout,
  refreshSession,
  register,
  setAccessToken,
  type LoginInput,
  type RegisterInput,
} from "@/lib/api";
import type { AppRole } from "@/lib/auth/roles";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  provider: "LOCAL";
  emailVerified: boolean;
  createdAt: string;
};

type MeResponse = {
  user: AuthUser | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  signIn: (payload: LoginInput) => Promise<void>;
  signUp: (payload: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fetchUserProfile = async (): Promise<AuthUser | null> => {
  const response = (await getMe()) as MeResponse;
  return response.user;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshProfile = useCallback(async (): Promise<void> => {
    const nextUser = await fetchUserProfile();
    setUser(nextUser);
  }, []);

  const signIn = useCallback(
    async (payload: LoginInput): Promise<void> => {
      const response = await login(payload);
      setAccessToken(response.accessToken);
      await refreshProfile();
    },
    [refreshProfile],
  );

  const signUp = useCallback(
    async (payload: RegisterInput): Promise<void> => {
      const response = await register(payload);
      setAccessToken(response.accessToken);
      await refreshProfile();
    },
    [refreshProfile],
  );

  const signOut = useCallback(async (): Promise<void> => {
    await logout();
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      hydrateAccessToken();

      try {
        await refreshProfile();
      } catch {
        try {
          const refreshed = await refreshSession();
          setAccessToken(refreshed.accessToken);
          await refreshProfile();
        } catch {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    void initializeAuth();
  }, [refreshProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      user,
      isInitializing,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
