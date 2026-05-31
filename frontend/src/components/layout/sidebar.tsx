'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  CalendarCheck,
  Award,
  FolderKanban,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  BarChart3,
  UserPlus,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['super_admin', 'admin', 'instructor', 'student'],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Attendance',
    href: '/attendance',
    icon: CalendarCheck,
    roles: ['super_admin', 'admin', 'instructor'],
  },
  {
    title: 'Assessments',
    href: '/assessments',
    icon: ClipboardCheck,
    roles: ['super_admin', 'admin', 'instructor', 'student'],
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    roles: ['super_admin', 'admin', 'instructor', 'student', 'mentor'],
  },
  {
    title: 'Certificates',
    href: '/certificates',
    icon: Award,
    roles: ['super_admin', 'admin', 'student'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'College Admin',
    href: '/college-admin',
    icon: UserPlus,
    roles: ['super_admin'],
  },
  {
    title: 'Trainer',
    href: '/trainer',
    icon: UserCog,
    roles: ['super_admin'],
  },
];

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
  } | null;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ user, collapsed = false, onToggle }, ref) => {
    const pathname = usePathname();

    const roleMap: Record<string, string> = {
      super_admin: 'super_admin',
      college_admin: 'admin',
      trainer: 'instructor',
      student: 'student',
    };

    const normalizedRole = roleMap[user?.role?.toLowerCase() ?? ''] ?? '';

    const filteredNavItems = navItems.filter((item) => {
      if (!item.roles) return true;
      if (!normalizedRole) return true;
      return item.roles.includes(normalizedRole as UserRole);
    });

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const NavLink = ({ item }: { item: NavItem }) => {
      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
      const Icon = item.icon;

      const linkContent = (
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 px-3 py-2 text-sm font-normal',
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-2',
          )}
          asChild
        >
          <Link href={item.href}>
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        </Button>
      );

      if (collapsed) {
        return (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              {item.title}
            </TooltipContent>
          </Tooltip>
        );
      }

      return linkContent;
    };

    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            collapsed && 'justify-center px-2',
          )}
        >
          {collapsed ? (
            <GraduationCap className="h-7 w-7 text-primary" />
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold text-sidebar-foreground">
                CampusSkill
              </span>
            </Link>
          )}
        </div>

        <ScrollArea className="flex-1 px-3 py-3">
          <TooltipProvider>
            <nav className="flex flex-col gap-1">
              {filteredNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        <div className="border-t p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground"
                onClick={onToggle}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">
                    {user?.name || 'User'}
                  </p>
                  <p className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground"
                onClick={onToggle}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    );
  },
);
Sidebar.displayName = 'Sidebar';

export { Sidebar, type NavItem };
export default Sidebar;
