import { atom } from 'jotai';
import type { User } from '@/types';

export function normalizeUser(user: User | null): User | null {
  if (!user) return null;
  return { ...user, role: user.role?.toLowerCase() as User['role'] };
}

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('user');
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

export const tokenAtom = atom<string | null>(getInitialToken());
export const userAtom = atom<User | null>(getInitialUser());
export const isAuthenticatedAtom = atom<boolean>((get) => !!get(tokenAtom));
export const userRoleAtom = atom<string | null>((get) => get(userAtom)?.role ?? null);
