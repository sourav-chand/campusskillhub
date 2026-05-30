'use client';

import * as React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">CampusSkill Hub</span>
        </Link>

        <div
          className={cn(
            'w-full rounded-xl border bg-card p-6 shadow-sm sm:p-8',
          )}
        >
          {title && (
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CampusSkill Hub. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export { AuthLayout };
export default AuthLayout;
