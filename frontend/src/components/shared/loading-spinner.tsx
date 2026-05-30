'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const LoadingSpinner = ({ size = 'default', text, className }: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className,
      )}
    >
      <Loader2
        className={cn('animate-spin text-primary', sizeMap[size])}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;
