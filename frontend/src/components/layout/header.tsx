'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  onMenuToggle?: () => void;
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

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Courses',
  users: 'Users',
  attendance: 'Attendance',
  assessments: 'Assessments',
  projects: 'Projects',
  certificates: 'Certificates',
  reports: 'Reports',
  notifications: 'Notifications',
  settings: 'Settings',
};

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      onMenuToggle,
      breadcrumbs,
      user,
      notificationCount = 0,
      onSearch,
      onLogout,
    },
    ref,
  ) => {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = React.useState('');
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const generatedBreadcrumbs = breadcrumbs || generateBreadcrumbs(pathname);

    function generateBreadcrumbs(path: string): BreadcrumbItem[] {
      const segments = path.split('/').filter(Boolean);
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }];

      segments.forEach((segment, index) => {
        const label =
          routeLabels[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);
        const href = '/' + segments.slice(0, index + 1).join('/');
        items.push({ label, href });
      });

      return items;
    }

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(searchValue);
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <header
        ref={ref}
        className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6"
      >
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          {generatedBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'hover:text-foreground transition-colors',
                    index === generatedBreadcrumbs.length - 1 &&
                      'font-medium text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    index === generatedBreadcrumbs.length - 1 &&
                      'font-medium text-foreground',
                  )}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex-1" />

        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </form>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              {notificationCount > 0
                ? `You have ${notificationCount} unread notifications`
                : 'No new notifications'}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="cursor-pointer">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ') || ''}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    );
  },
);
Header.displayName = 'Header';

export { Header, type BreadcrumbItem };
export default Header;
