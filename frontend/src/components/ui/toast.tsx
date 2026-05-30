'use client';

import * as React from 'react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const ToastProvider: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: 'var(--radius)',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--background))',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--background))',
          },
        },
      }}
    >
      {(t) => (
        <div
          className={cn(
            'flex items-center gap-2',
            t.type === 'success' && 'text-success',
            t.type === 'error' && 'text-destructive',
          )}
        >
          <span className="flex-1 text-sm">{t.message as React.ReactNode}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-md p-1 hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </HotToaster>
  );
};

function useToast() {
  return {
    toast: {
      success: (message: string) => toast.success(message),
      error: (message: string) => toast.error(message),
      loading: (message: string) => toast.loading(message),
      dismiss: (toastId?: string) => toast.dismiss(toastId),
      promise: <T,>(
        promise: Promise<T>,
        msgs: {
          loading: string;
          success: string | ((data: T) => string);
          error: string | ((err: unknown) => string);
        },
      ) => toast.promise(promise, msgs),
      custom: (message: string) =>
        toast(message, {
          icon: '📢',
        }),
    },
  };
}

export { ToastProvider as Toaster, useToast, toast };
export default ToastProvider;
