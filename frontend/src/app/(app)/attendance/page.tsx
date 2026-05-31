'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/data-table';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { PieChart, BarChart as RechartsBarChart } from '@/components/shared/charts';
import { BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CalendarDays,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import { cn, formatDate } from '@/lib/utils';
import type { Attendance, PieChartData } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [attendance, setAttendance] = React.useState<Attendance[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [dateFilter, setDateFilter] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState('all');
  const [markDialogOpen, setMarkDialogOpen] = React.useState(false);
  const [stats, setStats] = React.useState<{ present: number; absent: number; late: number; total: number } | null>(null);
  const { page, setPage, limit: pageSize } = usePagination(1, 10);

  const isTrainer = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  const fetchAttendance = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: pageSize };
      if (dateFilter) params.date = dateFilter;
      if (courseFilter !== 'all') params.course = courseFilter;

      const res = await attendanceService.getAll(params);
      setAttendance(res.data.data ?? []);
      setTotalItems((res.data as any).meta?.total ?? res.data.pagination?.total ?? 0);

      const statsRes = await attendanceService.getStats('all');
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, dateFilter, courseFilter]);

  React.useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'destructive' | 'warning' | 'secondary'> = {
      present: 'success',
      absent: 'destructive',
      late: 'warning',
      excused: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status === 'present' && <CheckCircle2 className="mr-1 h-3 w-3" />}
        {status === 'absent' && <XCircle className="mr-1 h-3 w-3" />}
        {status === 'late' && <Clock className="mr-1 h-3 w-3" />}
        {status === 'excused' && <AlertCircle className="mr-1 h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const student = row.original.student;
        return typeof student === 'string' ? student : student?.name || 'Unknown';
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      accessorKey: 'markedBy',
      header: 'Marked By',
      cell: ({ row }) => {
        const markedBy = row.original.markedBy;
        return typeof markedBy === 'string' ? markedBy : markedBy?.name || 'System';
      },
    },
    ...(isStudent ? [] : [{
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <Button variant="outline" size="sm">
          Edit
        </Button>
      ),
    }] as ColumnDef<Attendance>[]),
  ];

  const statsChart: PieChartData[] = stats
    ? [
        { name: 'Present', value: stats.present, color: '#22c55e' },
        { name: 'Absent', value: stats.absent, color: '#ef4444' },
        { name: 'Late', value: stats.late, color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">Track and manage student attendance</p>
        </div>
        {isTrainer && (
          <Button onClick={() => setMarkDialogOpen(true)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        )}
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-lg font-bold">{stats.present}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-bold">{stats.absent}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Late</p>
                <p className="text-lg font-bold">{stats.late}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Present %</p>
                <p className="text-lg font-bold">
                  {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-auto"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="course-1">Course 1</SelectItem>
            <SelectItem value="course-2">Course 2</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchAttendance}>
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="ml-auto gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statsChart.length > 0 ? (
              <PieChart
                data={statsChart as unknown as Record<string, unknown>[]}
                height={250}
                colors={['#22c55e', '#ef4444', '#f59e0b']}
              />
            ) : (
              <EmptyState title="No stats" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState icon={BarChart3} title="Monthly data" description="Select a date range to view" />
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Records</CardTitle>
          <CardDescription>{totalItems} records found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner text="Loading attendance..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchAttendance} />
          ) : (
            <DataTable
              columns={columns}
              data={attendance}
              searchable
              searchKey="student"
              searchPlaceholder="Search by student name..."
              currentPage={page}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              showPagination
              showExport
              onExportCSV={() => {}}
              onExportPDF={() => {}}
              emptyTitle="No attendance records"
              emptyDescription="Attendance records will appear here once marked"
            />
          )}
        </CardContent>
      </Card>

      {/* Mark Attendance Dialog */}
      <Dialog open={markDialogOpen} onOpenChange={setMarkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Select course and date to mark attendance for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course-1">Course 1</SelectItem>
                  <SelectItem value="course-2">Course 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setMarkDialogOpen(false)}>
              Start Marking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
