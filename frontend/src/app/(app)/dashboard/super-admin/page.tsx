'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/shared/stat-card';
import { BarChart, LineChart, PieChart, AreaChart } from '@/components/shared/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { analyticsService } from '@/services/analytics.service';
import { collegeService } from '@/services/college.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Plus,
  ExternalLink,
  Bell,
  FileText,
  Settings,
  Shield,
  CalendarDays,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { DashboardStats, LineChartData, PieChartData, BarChartData, College } from '@/types';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [enrollmentTrend, setEnrollmentTrend] = React.useState<LineChartData[]>([]);
  const [courseDistribution, setCourseDistribution] = React.useState<PieChartData[]>([]);
  const [revenueData, setRevenueData] = React.useState<LineChartData[]>([]);
  const [collegeGrowth, setCollegeGrowth] = React.useState<BarChartData[]>([]);
  const [pendingColleges, setPendingColleges] = React.useState<College[]>([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsRes,
        trendRes,
        courseDistRes,
        revenueRes,
        collegesRes,
      ] = await Promise.allSettled([
        analyticsService.getDashboardStats(),
        analyticsService.getEnrollmentTrend({ days: 30 }),
        analyticsService.getStudentDistribution(),
        analyticsService.getRevenueAnalytics(),
        collegeService.getAll({ page: 1, limit: 10 }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) setStats(statsRes.value.data.data);
      if (trendRes.status === 'fulfilled' && trendRes.value.data?.data) setEnrollmentTrend(trendRes.value.data.data);
      if (courseDistRes.status === 'fulfilled' && courseDistRes.value.data?.data) setCourseDistribution(courseDistRes.value.data.data);
      if (revenueRes.status === 'fulfilled' && revenueRes.value.data?.data) setRevenueData(revenueRes.value.data.data);

      if (collegesRes.status === 'fulfilled' && Array.isArray(collegesRes.value.data?.data)) {
        const items = collegesRes.value.data.data as College[];
        setCollegeGrowth(
          items.map((c: College) => ({
            label: c.name,
            value: 1,
          }))
        );
        const pending = items.filter((c: College) => !c.isActive);
        setPendingColleges(pending);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

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
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {stats?.totalInstructors || 0} Colleges
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          label="Total Colleges"
          value={stats?.totalInstructors || 0}
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          icon={Users}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          label="Total Students"
          value={stats?.totalStudents || 0}
          trend={{ value: 8, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          icon={GraduationCap}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          label="Total Trainers"
          value={stats?.totalInstructors || 0}
          trend={{ value: 5, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          icon={DollarSign}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/30"
          label="Total Revenue"
          value={`$${(stats?.revenue || 0).toLocaleString()}`}
          trend={{ value: 15, direction: 'up', label: 'vs last month' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Student Growth</CardTitle>
            <CardDescription>Enrollment trend over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentTrend.length > 0 ? (
              <LineChart
                data={enrollmentTrend as unknown as Record<string, unknown>[]}
                xKey="date"
                lines={[{ key: 'value', name: 'Students', color: '#3b82f6' }]}
                height={280}
                showLegend={false}
              />
            ) : (
              <EmptyState title="No enrollment data" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            {courseDistribution.length > 0 ? (
              <PieChart
                data={courseDistribution as unknown as Record<string, unknown>[]}
                height={280}
                showLabel
              />
            ) : (
              <EmptyState title="No course data" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">College Growth</CardTitle>
            <CardDescription>New colleges registered</CardDescription>
          </CardHeader>
          <CardContent>
            {collegeGrowth.length > 0 ? (
              <BarChart
                data={collegeGrowth as unknown as Record<string, unknown>[]}
                xKey="label"
                bars={[{ key: 'value', name: 'Colleges', color: '#8b5cf6' }]}
                height={280}
              />
            ) : (
              <EmptyState title="No college data" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length > 0 ? (
            <AreaChart
              data={revenueData as unknown as Record<string, unknown>[]}
              xKey="date"
              areas={[{ key: 'value', name: 'Revenue', color: '#22c55e' }]}
              height={300}
            />
          ) : (
            <EmptyState title="No revenue data" />
          )}
        </CardContent>
      </Card>

      {/* Recent Registrations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Pending College Approvals</CardTitle>
            <CardDescription>
              Colleges awaiting verification
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/users?filter=pending">
              View All
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pendingColleges.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingColleges.map((college) => (
                  <TableRow key={college._id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>{college.email}</TableCell>
                    <TableCell>{college.city}</TableCell>
                    <TableCell>{formatDate(college.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Building2}
              title="No pending approvals"
              description="All colleges have been verified"
            />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions + Platform Analytics */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/users">
                <Plus className="h-4 w-4" />
                Add New College
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/reports">
                <FileText className="h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Platform Settings
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                Send Notification
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Platform Analytics Summary</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Completion Rate
                </p>
                <p className="text-xl font-bold">{(stats?.completionRate || 0).toFixed(1)}%</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Active Enrollments
                </p>
                <p className="text-xl font-bold">{stats?.activeEnrollments || 0}</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Avg Rating
                </p>
                <p className="text-xl font-bold">{(stats?.averageRating || 0).toFixed(1)}</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Total Enrollments
                </p>
                <p className="text-xl font-bold">{stats?.totalEnrollments || 0}</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Total Courses
                </p>
                <p className="text-xl font-bold">{stats?.totalCourses || 0}</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Revenue
                </p>
                <p className="text-xl font-bold">${(stats?.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
