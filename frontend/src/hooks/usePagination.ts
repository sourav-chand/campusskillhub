'use client';

import { useState, useCallback, useMemo } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsePaginationReturn extends PaginationState {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
}

export function usePagination(initialPage = 1, initialLimit = 10): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const hasNextPage = state.page < state.totalPages;
  const hasPrevPage = state.page > 1;

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) =>
      prev.page < prev.totalPages ? { ...prev, page: prev.page + 1 } : prev,
    );
  }, []);

  const prevPage = useCallback(() => {
    setState((prev) =>
      prev.page > 1 ? { ...prev, page: prev.page - 1 } : prev,
    );
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setState((prev) => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit) || 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
    });
  }, [initialPage, initialLimit]);

  return useMemo(
    () => ({
      ...state,
      hasNextPage,
      hasPrevPage,
      setPage,
      nextPage,
      prevPage,
      setLimit,
      setTotal,
      reset,
    }),
    [state, hasNextPage, hasPrevPage, setPage, nextPage, prevPage, setLimit, setTotal, reset],
  );
}
