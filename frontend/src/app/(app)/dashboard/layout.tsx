'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const roleRedirectMap: Record<string, string> = {
  super_admin: '/dashboard/super-admin',
  college_admin: '/dashboard/college-admin',
  trainer: '/dashboard/trainer',
  student: '/dashboard/student',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (user && pathname === '/dashboard') {
      const redirectPath = roleRedirectMap[user.role] || '/dashboard/student';
      router.replace(redirectPath);
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
