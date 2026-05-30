'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { AuthProvider } from '@/components/shared/auth-provider';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export { AppShell };
export default AppShell;
