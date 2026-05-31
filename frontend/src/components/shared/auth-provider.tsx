'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { userAtom, tokenAtom } from '@/store/auth';
import * as authLib from '@/lib/auth';
import api from '@/lib/axios';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuthContext() {
  return React.useContext(AuthContext);
}

const publicRoutes = ['/', '/login', '/register', '/forgot-password'];

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authLib.getToken();
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        const storedUser = authLib.getUser<User>();
        if (storedUser) {
          setUser(storedUser);
        }

        const { data } = await api.get<{ success: boolean; data: User }>(
          '/auth/me',
        );
        setUser(data.data);
        authLib.setUser(data.data);
      } catch {
        authLib.removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  React.useEffect(() => {
    if (!isLoading && !token && !isPublicRoute) {
      router.push('/login');
    }
  }, [isLoading, token, isPublicRoute, router]);

  const logout = React.useCallback(() => {
    authLib.removeToken();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [setToken, setUser, router]);

  const refreshUser = React.useCallback(async () => {
    try {
      const { data } = await api.get<{ success: boolean; data: User }>(
        '/auth/me',
      );
      setUser(data.data);
      authLib.setUser(data.data);
    } catch {
      logout();
    }
  }, [setUser, logout]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
export default AuthProvider;
