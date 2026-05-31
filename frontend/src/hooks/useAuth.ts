'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom, tokenAtom, normalizeUser } from '@/store/auth';
import * as authLib from '@/lib/auth';
import api from '@/lib/axios';
import type { User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  collegeCode?: string;
}

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await api.post('/auth/login', payload);
      const { tokens, user: userData } = data.data;
      const normalized = normalizeUser(userData);
      authLib.setToken(tokens.accessToken);
      authLib.setUser(normalized);
      setToken(tokens.accessToken);
      setUser(normalized);
      return normalized;
    },
    [setToken, setUser],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const { data } = await api.post('/auth/register', payload);
      return data.data;
    },
    [],
  );

  const logout = useCallback(() => {
    authLib.removeToken();
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  const getMe = useCallback(async () => {
    const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
    const normalized = normalizeUser(data.data);
    setUser(normalized);
    authLib.setUser(normalized);
    return normalized;
  }, [setUser]);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    getMe,
  };
}
