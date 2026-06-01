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
    // Prevent html and body from scrolling to avoid double scrollbars
    const html = document.documentElement;
    const body = document.body;
    
    const originalHtmlOverflow = html.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyHeight = body.style.height;

    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';

    return () => {
      html.style.overflow = originalHtmlOverflow;
      html.style.height = originalHtmlHeight;
      body.style.overflow = originalBodyOverflow;
      body.style.height = originalBodyHeight;
    };
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
