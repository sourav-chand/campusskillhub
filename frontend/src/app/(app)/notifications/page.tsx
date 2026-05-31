'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Separator } from '@/components/ui/separator';
import { notificationService } from '@/services/notification.service';
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MailOpen,
  CheckCheck,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';
import { cn, formatDateTime, formatDate } from '@/lib/utils';
import type { Notification } from '@/types';

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('all');
  const { page, setPage, limit: pageSize } = usePagination(1, 20);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: pageSize };
      if (activeTab === 'unread') params.isRead = false;

      const res = await notificationService.getAll(params);
      setNotifications(res.data.data ?? []);
      setTotalItems((res.data as any).meta?.total ?? res.data.pagination?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, activeTab]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // handled
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // handled
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // handled
    }
  };

  const filteredNotifications = activeTab === 'all' ? notifications : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay updated with the latest events
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Bell className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            <MailOpen className="h-4 w-4" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1.5">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">Info</TabsTrigger>
          <TabsTrigger value="warning" className="gap-2">Warnings</TabsTrigger>
          <TabsTrigger value="error" className="gap-2">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <LoadingSpinner size="lg" text="Loading notifications..." />
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetchNotifications} />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            />
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => {
                const config = typeConfig[notification.type] || typeConfig.info;
                const Icon = config.icon;

                return (
                  <div
                    key={notification._id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg p-4 transition-colors hover:bg-muted/50',
                      !notification.isRead && 'bg-muted/30 border-l-2 border-l-primary',
                    )}
                    onClick={() => !notification.isRead && handleMarkRead(notification._id)}
                  >
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', config.bg)}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn('text-sm', !notification.isRead && 'font-semibold')}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(notification.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {notification.type}
                        </Badge>
                        {notification.link && (
                          <a href={notification.link} className="text-xs text-primary hover:underline">
                            View details
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {totalItems > pageSize && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(totalItems / pageSize)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
