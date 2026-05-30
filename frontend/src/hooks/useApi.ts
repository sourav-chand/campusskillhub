'use client';

import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export function useApi<T>(
  apiFunc: (...args: unknown[]) => Promise<{ data: { data: T } }>,
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiFunc(...args);
        setState({ data: response.data.data, loading: false, error: null });
        return response.data.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An error occurred';
        setState((prev) => ({ ...prev, loading: false, error: message }));
      }
    },
    [apiFunc],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset, setData: (data) => setState((prev) => ({ ...prev, data })) };
}
