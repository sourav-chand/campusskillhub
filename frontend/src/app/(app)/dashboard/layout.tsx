'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const roleRedirectMap: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  super_admin: '/dashboard/super-admin',
  COLLEGE_ADMIN: '/dashboard/college-admin',
  admin: '/dashboard/college-admin',
  TRAINER: '/dashboard/trainer',
  instructor: '/dashboard/trainer',
  STUDENT: '/dashboard/student',
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
