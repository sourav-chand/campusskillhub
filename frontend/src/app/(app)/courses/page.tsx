'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchInput } from '@/components/shared/search-input';
import { courseService } from '@/services/course.service';
import {
  BookOpen,
  Plus,
  Grid3X3,
  List,
  Star,
  Users,
  Clock,
  Edit3,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Course } from '@/types';

const categories = [
  'All',
  // 'Programming',
  // 'Data Science',
  // 'Web Development',
  // 'Mobile Apps',
  // 'AI & ML',
  // 'Cloud Computing',
  // 'Cybersecurity',
];

export default function CoursesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [totalItems, setTotalItems] = React.useState(0);
  const { page, setPage, limit: pageSize } = usePagination(1, 12);

  const isTrainer = user?.role === 'instructor';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const fetchCourses = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: pageSize };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await courseService.getAll(params);
      setCourses(res.data.data ?? []);
      setTotalItems((res.data as any).meta?.total ?? res.data.pagination?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedCategory]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.delete(courseId);
      fetchCourses();
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">
            {isTrainer ? 'Manage your courses' : isStudent ? 'Browse and enroll in courses' : 'View all courses'}
          </p>
        </div>
        {(isTrainer || isAdmin) && (
          <Button asChild>
            <Link href="/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search courses..."
            onSearch={(q) => { setSearchQuery(q); setPage(1); }}
            className="w-64"
          />
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading courses..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCourses} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={searchQuery ? 'Try a different search term' : 'No courses available yet'}
          actionLabel={isTrainer ? 'Create Course' : undefined}
          onAction={isTrainer ? () => window.location.href = '/courses/new' : undefined}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => {
            const courseId = (course as any).id || course._id;
            return (
            <Link key={courseId} href={`/courses/${courseId}`}>
              <Card className="group h-full transition-colors hover:bg-muted/50">
                <div className="aspect-video w-full rounded-t-lg bg-muted flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Badge variant="outline" className="mb-1.5 text-xs">
                        {course.category}
                      </Badge>
                      <h3 className="font-semibold truncate">{course.title}</h3>
                    </div>
                    {isTrainer && (
                      <div className="flex gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/courses/${courseId}/edit`}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(courseId)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {(course as any).enrollmentCount ?? course.enrolledCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {((course as any).averageRating ?? course.rating ?? 0).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {(course as any).totalDuration ?? course.duration ?? 0}h
                    </span>
                  </div>
                  {isStudent && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 100)} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {courses.map((course) => {
            const courseId = (course as any).id || course._id;
            const instructorName = (course as any).trainerName || (typeof (course as any).instructor === 'string' ? (course as any).instructor : (course as any).instructor?.name) || 'Instructor';
            return (
            <Link key={courseId} href={`/courses/${courseId}`}>
              <div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <BookOpen className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{course.title}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs">{course.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {course.shortDescription || course.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {instructorName}
                    </span>
                    <span>{course.modules?.length || 0} modules</span>
                    <span>{(course as any).enrollmentCount ?? course.enrolledCount ?? 0} students</span>
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {isStudent && (
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 100)} className="h-1.5" />
                    </div>
                  )}
                  <Badge variant={course.isPublished ? 'success' : 'warning'}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
