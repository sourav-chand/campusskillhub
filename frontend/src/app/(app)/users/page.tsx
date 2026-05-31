'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { userService } from '@/services/user.service';
import { formatDate } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, UserCog, GraduationCap, Search, Users } from 'lucide-react';

const roleConfig: Record<string, { label: string; icon: typeof ShieldAlert; color: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', icon: ShieldAlert, color: 'text-red-600' },
  COLLEGE_ADMIN: { label: 'College Admin', icon: ShieldCheck, color: 'text-blue-600' },
  TRAINER: { label: 'Trainer', icon: UserCog, color: 'text-purple-600' },
  STUDENT: { label: 'Student', icon: GraduationCap, color: 'text-emerald-600' },
  super_admin: { label: 'Super Admin', icon: ShieldAlert, color: 'text-red-600' },
  admin: { label: 'College Admin', icon: ShieldCheck, color: 'text-blue-600' },
  instructor: { label: 'Trainer', icon: UserCog, color: 'text-purple-600' },
  student: { label: 'Student', icon: GraduationCap, color: 'text-emerald-600' },
};

export default function UsersPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userService.getAll();
      setUsers(res.data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      await userService.deactivate(userId);
      fetchUsers();
    } catch {
    }
  };

  const filtered = React.useMemo(() => {
    let result = users;
    if (statusFilter === 'active') {
      result = result.filter((u: any) => u.isActive === true);
    } else if (statusFilter === 'inactive') {
      result = result.filter((u: any) => u.isActive === false);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u: any) => {
        const name = ((u.firstName as string) || '') + ' ' + ((u.lastName as string) || '');
        return name.toLowerCase().includes(q) || (u.email as string)?.toLowerCase().includes(q);
      });
    }
    return result;
  }, [users, statusFilter, searchQuery]);

  const RoleBadge = ({ role }: { role: string }) => {
    const config = roleConfig[role] || { label: role, icon: UserCog, color: 'text-muted-foreground' };
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'active' as const, label: 'Active' },
    { key: 'inactive' as const, label: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users across the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={statusFilter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading users..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={searchQuery ? 'Try a different search term' : 'No users registered yet'}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u: any) => {
                const userId = u.id || u._id;
                const firstName = u.firstName || '';
                const lastName = u.lastName || '';
                const fullName = firstName || lastName ? `${firstName} ${lastName}` : u.name || 'Unknown';
                const avatar = u.avatar;
                const email = u.email;
                const active = u.isActive;
                return (
                  <TableRow key={userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatar} alt={fullName} />
                          <AvatarFallback className="text-xs">
                            {fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={active ? 'success' : 'warning'}>
                        {active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${userId}`}>View</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(userId)}
                        >
                          {active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
