'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/shared/stat-card';
import { BarChart, LineChart, PieChart } from '@/components/shared/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { analyticsService } from '@/services/analytics.service';
import { courseService } from '@/services/course.service';
import {
  Users,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Plus,
  Eye,
  Clock,
  FileText,
  UserPlus,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { DashboardStats, LineChartData, BarChartData, PieChartData, Enrollment, Course } from '@/types';

export default function CollegeAdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [performanceData, setPerformanceData] = React.useState<BarChartData[]>([]);
  const [attendanceData, setAttendanceData] = React.useState<LineChartData[]>([]);
  const [completionData, setCompletionData] = React.useState<PieChartData[]>([]);
  const [recentEnrollments, setRecentEnrollments] = React.useState<Enrollment[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = React.useState<{ title: string; dueDate: string; course: string }[]>([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const collegeId = user?.college;
      const params = collegeId ? { college: collegeId } : {};

      const [statsRes, perfRes, attRes, compRes, coursesRes] = await Promise.allSettled([
        analyticsService.getDashboardStats(params),
        analyticsService.getTopCourses({ limit: 6, ...params }),
        analyticsService.getAttendanceAnalytics(params),
        analyticsService.getCourseCompletion(params),
        courseService.getAll({ page: 1, limit: 10, ...(collegeId ? { college: collegeId } : {}) }),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
      if (perfRes.status === 'fulfilled') setPerformanceData(perfRes.value.data.data);
      if (attRes.status === 'fulfilled') setAttendanceData(attRes.value.data.data as unknown as LineChartData[]);
      if (compRes.status === 'fulfilled') setCompletionData(compRes.value.data.data as unknown as PieChartData[]);

      if (coursesRes.status === 'fulfilled') {
        const courses = coursesRes.value.data.data;
        const deadlines = courses
          .filter((c: Course) => c.isPublished)
          .slice(0, 5)
          .map((c: Course) => ({
            title: `Course Review: ${c.title}`,
            dueDate: c.updatedAt,
            course: c.title,
          }));
        setUpcomingDeadlines(deadlines);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user?.college || 'College'} Dashboard
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateStr}
          </p>
        </div>
        <Badge variant="outline" className="gap-1 capitalize">
          <Building2 className="h-3.5 w-3.5" />
          {user?.college || 'College Admin'}
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          label="Total Students"
          value={stats?.totalStudents || 0}
          trend={{ value: 10, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          label="Active Students"
          value={stats?.activeEnrollments || 0}
          trend={{ value: 5, direction: 'up', label: 'this month' }}
        />
        <StatCard
          icon={BookOpen}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          label="Course Completion Rate"
          value={`${(stats?.completionRate || 0).toFixed(1)}%`}
          trend={{ value: 3, direction: 'up', label: 'improvement' }}
        />
        <StatCard
          icon={ClipboardCheck}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/30"
          label="Avg Assessment Score"
          value={`${(stats?.averageRating || 0).toFixed(1)}%`}
          trend={{ value: 2, direction: 'up', label: 'vs last month' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Student Performance</CardTitle>
            <CardDescription>Top courses by student count</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData.length > 0 ? (
              <BarChart
                data={performanceData as unknown as Record<string, unknown>[]}
                xKey="label"
                bars={[{ key: 'value', name: 'Students', color: '#3b82f6' }]}
                layout="vertical"
                height={300}
              />
            ) : (
              <EmptyState title="No performance data" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Attendance Rate</CardTitle>
            <CardDescription>Daily attendance trend</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <LineChart
                data={attendanceData as unknown as Record<string, unknown>[]}
                xKey="date"
                lines={[{ key: 'value', name: 'Attendance', color: '#22c55e' }]}
                height={300}
              />
            ) : (
              <EmptyState title="No attendance data" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Course Completion</CardTitle>
            <CardDescription>Completion status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {completionData.length > 0 ? (
              <PieChart
                data={completionData as unknown as Record<string, unknown>[]}
                height={300}
                showLabel
              />
            ) : (
              <EmptyState title="No completion data" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Enrollments</CardTitle>
            <CardDescription>Latest student enrollments</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">
              <Eye className="mr-2 h-3.5 w-3.5" />
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentEnrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnrollments.map((enrollment) => (
                  <TableRow key={enrollment._id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>{(typeof enrollment.student === 'string' ? 'S' : enrollment.student?.name?.[0] || 'S')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {typeof enrollment.student === 'string' ? enrollment.student : enrollment.student?.name}
                      </span>
                    </TableCell>
                    <TableCell>{typeof enrollment.course === 'string' ? enrollment.course : enrollment.course?.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs">{enrollment.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={enrollment.status === 'active' ? 'success' : enrollment.status === 'completed' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(enrollment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Users}
              title="No recent enrollments"
              description="Enrollments will appear here once students join courses"
            />
          )}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines & Events</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{deadline.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Due</p>
                      <p className="text-sm font-medium">{formatDate(deadline.dueDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming deadlines"
                description="All caught up!"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/users">
                <UserPlus className="h-4 w-4" />
                Add Student
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/reports">
                <FileText className="h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/attendance">
                <ClipboardCheck className="h-4 w-4" />
                Mark Attendance
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="2" rx="2" />
      <path d="M4 14h16" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M10 22v-4h4v4" />
    </svg>
  );
}
