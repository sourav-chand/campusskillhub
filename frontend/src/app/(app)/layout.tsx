'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout as DashboardShell } from '@/components/layout/dashboard-layout';
import { AppShell } from '@/components/layout/app-shell';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <AppShell>
      <DashboardShell
        user={{
          name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || '',
          email: user?.email || '',
          avatar: user?.avatar,
          role: (user?.role ?? 'student') as never,
        }}
        onLogout={logout}
      >
        {children}
      </DashboardShell>
    </AppShell>
  );
}
