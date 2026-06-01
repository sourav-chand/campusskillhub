const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.role || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function setUser(user: unknown): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as T) : null;
  } catch {
    return null;
  }
}
