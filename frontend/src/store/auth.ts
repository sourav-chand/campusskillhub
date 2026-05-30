import { atom } from 'jotai';
import type { User } from '@/types';

export const userAtom = atom<User | null>(null);
export const tokenAtom = atom<string | null>(null);
export const isAuthenticatedAtom = atom<boolean>((get) => !!get(tokenAtom));
export const userRoleAtom = atom<string | null>((get) => get(userAtom)?.role ?? null);
