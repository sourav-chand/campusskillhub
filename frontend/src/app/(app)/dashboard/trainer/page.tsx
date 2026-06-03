'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/shared/stat-card';
import { BarChart, LineChart, AreaChart } from '@/components/shared/charts';
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
  BookOpen,
  Users,
  ClipboardList,
  Star,
  CalendarDays,
  Plus,
  Upload,
  Video,
  FileText,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { DashboardStats, BarChartData, LineChartData, Course } from '@/types';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [studentPerformance, setStudentPerformance] = React.useState<BarChartData[]>([]);
  const [assessmentScores, setAssessmentScores] = React.useState<LineChartData[]>([]);
  const [attendanceData, setAttendanceData] = React.useState<LineChartData[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [pendingGrading, setPendingGrading] = React.useState<{ id: string; title: string; student: string; course: string; submittedAt: string }[]>([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, perfRes, assessmentRes, attRes, coursesRes] = await Promise.allSettled([
        analyticsService.getDashboardStats(),
        analyticsService.getTopCourses({ limit: 6 }),
        analyticsService.getPerformanceMetrics(),
        analyticsService.getAttendanceAnalytics(),
        courseService.getAll({ page: 1, limit: 10 }),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
      if (perfRes.status === 'fulfilled') setStudentPerformance(perfRes.value.data.data);
      if (assessmentRes.status === 'fulfilled') {
        const data = assessmentRes.value.data.data;
        const chartData = Object.entries(data).map(([key, val]) => ({
          date: key,
          value: Number(val),
        }));
        setAssessmentScores(chartData);
      }
      if (attRes.status === 'fulfilled') setAttendanceData(attRes.value.data.data as unknown as LineChartData[]);

      if (coursesRes.status === 'fulfilled') {
        const courseData = coursesRes.value.data?.data ?? [];
        setCourses(courseData);
        const grading = courseData
          .filter((c: Course) => c.isPublished)
          .slice(0, 5)
          .map((c: Course) => ({
            id: c._id,
            title: `Assignment: ${c.title}`,
            student: 'Multiple students',
            course: c.title,
            submittedAt: c.updatedAt,
          }));
        setPendingGrading(grading);
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
            Welcome, {user?.name?.split(' ')[0] || 'Trainer'}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateStr}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1 capitalize">
          <GraduationCap className="h-3.5 w-3.5" />
          Trainer
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          label="Total Courses"
          value={stats?.totalCourses || 0}
          trend={{ value: 2, direction: 'up', label: 'this semester' }}
        />
        <StatCard
          icon={Users}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          label="Active Students"
          value={stats?.activeEnrollments || 0}
          trend={{ value: 8, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          icon={ClipboardList}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/30"
          label="Assignments to Grade"
          value={pendingGrading.length}
          trend={{ value: pendingGrading.length > 5 ? 20 : 0, direction: pendingGrading.length > 5 ? 'up' : 'neutral' }}
        />
        <StatCard
          icon={Star}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          label="Avg Class Rating"
          value={(stats?.averageRating || 0).toFixed(1)}
          trend={{ value: 4.5, direction: 'up', label: 'out of 5' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Student Performance</CardTitle>
            <CardDescription>Per course performance</CardDescription>
          </CardHeader>
          <CardContent>
            {studentPerformance.length > 0 ? (
              <BarChart
                data={studentPerformance as unknown as Record<string, unknown>[]}
                xKey="label"
                bars={[{ key: 'value', name: 'Score', color: '#3b82f6' }]}
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
            <CardTitle className="text-base">Assessment Scores</CardTitle>
            <CardDescription>Average scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            {assessmentScores.length > 0 ? (
              <LineChart
                data={assessmentScores as unknown as Record<string, unknown>[]}
                xKey="date"
                lines={[{ key: 'value', name: 'Score', color: '#8b5cf6' }]}
                height={300}
              />
            ) : (
              <EmptyState title="No assessment data" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Attendance</CardTitle>
            <CardDescription>Class attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <AreaChart
                data={attendanceData as unknown as Record<string, unknown>[]}
                xKey="date"
                areas={[{ key: 'value', name: 'Attendance', color: '#22c55e' }]}
                height={300}
              />
            ) : (
              <EmptyState title="No attendance data" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Courses Overview</CardTitle>
            <CardDescription>Your active courses</CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/courses">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Create Course
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.slice(0, 5).map((course, index) => (
                  <TableRow key={course._id ?? `course-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                          {course.title.charAt(0)}
                        </div>
                        <span className="font-medium">{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.category}</Badge>
                    </TableCell>
                    <TableCell>{(course as any).enrollmentCount ?? course.enrolledCount ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{((course as any).averageRating ?? course.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.isPublished ? 'success' : 'warning'}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Create your first course to get started"
              actionLabel="Create Course"
              onAction={() => window.location.href = '/courses'}
            />
          )}
        </CardContent>
      </Card>

      {/* Pending Grading + Upcoming Classes + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Grading</CardTitle>
            <CardDescription>Assignments awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingGrading.length > 0 ? (
              <div className="space-y-3">
                {pendingGrading.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <ClipboardList className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.course}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </div>
                  </div>
                ))}
                <Button variant="link" size="sm" className="w-full" asChild>
                  <Link href="/assessments">View all submissions</Link>
                </Button>
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Nothing to grade"
                description="All assignments have been graded"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Live Classes</CardTitle>
            <CardDescription>Scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Video}
              title="No upcoming classes"
              description="Schedule a live class to get started"
              actionLabel="Schedule Class"
              onAction={() => window.location.href = '/courses'}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <Upload className="h-4 w-4" />
                Upload Material
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <Video className="h-4 w-4" />
                Schedule Class
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/assessments">
                <FileText className="h-4 w-4" />
                Create Assessment
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
