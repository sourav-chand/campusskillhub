'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout as DashboardShell } from '@/components/layout/dashboard-layout';
import { AppShell } from '@/components/layout/app-shell';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

const roleRedirectMap: Record<string, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/college-admin',
  instructor: '/dashboard/trainer',
  student: '/dashboard/student',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && pathname === '/dashboard') {
      const redirectPath = roleRedirectMap[user.role] || '/dashboard/student';
      router.replace(redirectPath);
    }
  }, [mounted, isAuthenticated, user, pathname, router]);

  if (!mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <AppShell>
      <DashboardShell
        user={{
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || '',
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        }}
        onLogout={logout}
      >
        {children}
      </DashboardShell>
    </AppShell>
  );
}
