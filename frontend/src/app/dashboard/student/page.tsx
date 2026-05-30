'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/shared/stat-card';
import { LineChart, PieChart } from '@/components/shared/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { analyticsService } from '@/services/analytics.service';
import { courseService } from '@/services/course.service';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Clock,
  FileText,
  Video,
  ClipboardList,
  ArrowRight,
  Award,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { DashboardStats, LineChartData, PieChartData, Course, Enrollment } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [weeklyScores, setWeeklyScores] = React.useState<LineChartData[]>([]);
  const [attendanceData, setAttendanceData] = React.useState<PieChartData[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = React.useState<{ course: Course; progress: number }[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<{ action: string; detail: string; time: string }[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<{ title: string; date: string; type: string }[]>([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, courseRes] = await Promise.allSettled([
        analyticsService.getDashboardStats(),
        courseService.getAll({ page: 1, limit: 10 }),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
      if (courseRes.status === 'fulfilled') {
        const courseData = courseRes.value.data.data;
        setCourses(courseData);
        setEnrolledCourses(
          courseData.slice(0, 4).map((c: Course) => ({
            course: c,
            progress: Math.floor(Math.random() * 100),
          }))
        );
      }

      setWeeklyScores([
        { date: 'Mon', value: 75 },
        { date: 'Tue', value: 82 },
        { date: 'Wed', value: 68 },
        { date: 'Thu', value: 90 },
        { date: 'Fri', value: 85 },
        { date: 'Sat', value: 78 },
        { date: 'Sun', value: 88 },
      ]);

      setAttendanceData([
        { name: 'Present', value: 85, color: '#22c55e' },
        { name: 'Absent', value: 8, color: '#ef4444' },
        { name: 'Late', value: 7, color: '#f59e0b' },
      ]);

      setRecentActivity([
        { action: 'Submitted Assignment', detail: 'Week 4 - Data Structures', time: '2 hours ago' },
        { action: 'Completed Module', detail: 'Introduction to Algorithms', time: '1 day ago' },
        { action: 'Scored on Quiz', detail: 'Python Basics - 85%', time: '2 days ago' },
        { action: 'Enrolled in Course', detail: 'Advanced JavaScript', time: '3 days ago' },
      ]);

      setUpcomingEvents([
        { title: 'Midterm Exam', date: '2026-06-15', type: 'exam' },
        { title: 'Project Submission', date: '2026-06-20', type: 'deadline' },
        { title: 'Live Class - React', date: '2026-06-10', type: 'class' },
      ]);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1 capitalize">
          <BookOpen className="h-3.5 w-3.5" />
          Student
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          label="Enrolled Courses"
          value={stats?.totalCourses || 0}
        />
        <StatCard
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          label="Completed Courses"
          value={stats?.totalEnrollments || 0}
          trend={{ value: 2, direction: 'up', label: 'this semester' }}
        />
        <StatCard
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          label="Average Score"
          value={`${(stats?.averageRating || 0).toFixed(1)}%`}
          trend={{ value: 5, direction: 'up', label: 'improvement' }}
        />
        <StatCard
          icon={CalendarDays}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/30"
          label="Attendance Rate"
          value="92%"
          trend={{ value: 3, direction: 'up', label: 'this month' }}
        />
      </div>

      {/* Charts + Learning Progress */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Learning Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Learning Progress</CardTitle>
            <CardDescription>Course completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((item) => (
                <div key={item.course._id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{item.course.title}</span>
                    <span className="text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))
            ) : (
              <EmptyState title="No courses" description="Enroll in a course to track progress" />
            )}
          </CardContent>
        </Card>

        {/* Weekly Scores */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Weekly Scores</CardTitle>
            <CardDescription>Assessment scores this week</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyScores.length > 0 ? (
              <LineChart
                data={weeklyScores as unknown as Record<string, unknown>[]}
                xKey="date"
                lines={[{ key: 'value', name: 'Score', color: '#8b5cf6' }]}
                height={220}
              />
            ) : (
              <EmptyState title="No scores yet" />
            )}
          </CardContent>
        </Card>

        {/* Attendance Pie */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Attendance</CardTitle>
            <CardDescription>Overall attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <PieChart
                data={attendanceData as unknown as Record<string, unknown>[]}
                height={220}
                showLabel
                colors={['#22c55e', '#ef4444', '#f59e0b']}
              />
            ) : (
              <EmptyState title="No attendance data" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Courses Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">My Courses</CardTitle>
            <CardDescription>Your enrolled courses</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">
              View All
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {enrolledCourses.map((item) => (
                <Link key={item.course._id} href={`/courses/${item.course._id}`}>
                  <div className="group rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h4 className="mb-1 font-medium truncate group-hover:text-primary transition-colors">
                      {item.course.title}
                    </h4>
                    <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                      {item.course.shortDescription || item.course.description}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No enrolled courses"
              description="Browse courses to start learning"
              actionLabel="Browse Courses"
              onAction={() => window.location.href = '/courses'}
            />
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events + Recent Activity + Quick Links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <CardDescription>Tests, deadlines & classes</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30' :
                      event.type === 'deadline' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        event.type === 'exam' ? 'text-red-600' :
                        event.type === 'deadline' ? 'text-amber-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {formatDate(event.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming events" description="You're all caught up!" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No recent activity" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <BookOpen className="h-4 w-4" />
                Study Materials
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/assessments">
                <ClipboardList className="h-4 w-4" />
                Assignments
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/courses">
                <Video className="h-4 w-4" />
                Live Classes
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/certificates">
                <Award className="h-4 w-4" />
                Certificates
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
