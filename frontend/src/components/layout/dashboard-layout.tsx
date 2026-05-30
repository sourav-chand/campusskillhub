'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/sidebar';
import { Header, type BreadcrumbItem } from '@/components/layout/header';
import type { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
  } | null;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

const DashboardLayout = ({
  children,
  breadcrumbs,
  user,
  notificationCount,
  onSearch,
  onLogout,
}: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r md:block',
          sidebarCollapsed ? 'md:w-[72px]' : 'md:w-[260px]',
        )}
      >
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] border-r bg-sidebar transition-transform duration-300 md:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar
          user={user}
          collapsed={false}
          onToggle={() => setMobileSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          breadcrumbs={breadcrumbs}
          user={user}
          notificationCount={notificationCount}
          onSearch={onSearch}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
export default DashboardLayout;
