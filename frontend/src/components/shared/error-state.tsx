'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, type LucideIcon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({
  icon: Icon = AlertTriangle,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retryLabel = 'Try Again',
  onRetry,
  className,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-destructive/20 p-8 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="mb-4 max-w-xs text-sm text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export { ErrorState };
export default ErrorState;
