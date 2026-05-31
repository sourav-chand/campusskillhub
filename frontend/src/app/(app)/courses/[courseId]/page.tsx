'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
import { courseService } from '@/services/course.service';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Download,
  Play,
  FileText,
  CheckCircle2,
  Video,
  GraduationCap,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Course, Module, Lesson } from '@/types';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [course, setCourse] = React.useState<Course | null>(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  const isTrainer = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  const fetchCourse = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseService.getById(courseId);
      setCourse(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  React.useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading course..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCourse} />;
  }

  if (!course) {
    return <EmptyState icon={BookOpen} title="Course not found" description="The course you're looking for doesn't exist" />;
  }

  const instructorName = (course as any).trainerName || (typeof (course as any).instructor === 'string' ? (course as any).instructor : (course as any).instructor?.name) || 'Unknown';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/courses">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Courses
        </Link>
      </Button>

      {/* Course Header */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden lg:w-2/5">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-16 w-16 text-muted-foreground/30" />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{course.category}</Badge>
            <Badge variant="outline" className="capitalize">{course.level}</Badge>
            <Badge variant={course.isPublished ? 'success' : 'warning'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold lg:text-3xl">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              {instructorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {course.duration} hours
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              {(course as any).enrollmentCount ?? course.enrolledCount ?? 0} students
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {((course as any).averageRating ?? course.rating ?? 0).toFixed(1)} rating
            </span>
          </div>
          {isStudent && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Your Progress</span>
                <span className="text-muted-foreground">{Math.floor(Math.random() * 100)}%</span>
              </div>
              <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
            </div>
          )}
          <div className="flex gap-2">
            {isStudent && (
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            )}
            {isTrainer && (
              <Button variant="outline" asChild>
                <Link href={`/courses/${courseId}/edit`}>
                  Edit Course
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          {isTrainer && <TabsTrigger value="students">Students</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{course.duration}h</p>
                </div>
                <div className="space-y-1 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Modules</p>
                  <p className="font-semibold">{course.modules?.length || 0}</p>
                </div>
                <div className="space-y-1 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="font-semibold capitalize">{course.level}</p>
                </div>
                <div className="space-y-1 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
<p className="font-semibold">{(course as any).enrollmentCount ?? course.enrolledCount ?? 0}</p>
              </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Curriculum</CardTitle>
              <CardDescription>{course.modules?.length || 0} modules</CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-2">
                  {course.modules.map((module, idx) => (
                    <details key={module._id} className="group rounded-lg border" open={idx === 0}>
                      <summary className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-2 text-left">
                          <span className="font-medium">{module.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ({module.lessons?.length || 0} lessons)
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <Separator />
                      <div className="space-y-2 p-4">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson) => (
                            <div key={lesson._id} className="flex items-center justify-between rounded-lg border p-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {lesson.videoUrl ? (
                                  <Play className="h-4 w-4 text-primary shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{lesson.title}</p>
                                  {lesson.description && (
                                    <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">{lesson.duration}min</span>
                                {lesson.videoUrl && (
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Play className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No lessons yet</p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              ) : isTrainer ? (
                <EmptyState
                  icon={BookOpen}
                  title="No curriculum yet"
                  description="Start building your course by adding modules and lessons"
                  actionLabel="Add Modules"
                  onAction={() => window.location.href = `/courses/${courseId}/edit`}
                />
              ) : (
                <EmptyState icon={BookOpen} title="No curriculum yet" description="Curriculum is being prepared by the instructor" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study Materials</CardTitle>
              <CardDescription>Downloadable resources</CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules?.some(m => m.lessons?.some(l => l.resources?.length)) ? (
                <div className="space-y-3">
                  {course.modules.map((module) =>
                    module.lessons?.filter(l => l.resources?.length).map((lesson) =>
                      lesson.resources?.map((resource, idx) => (
                        <div key={`${lesson._id}-${idx}`} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{resource.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={resource.url} download>
                              <Download className="mr-2 h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                        </div>
                      ))
                    )
                  )}
                </div>
              ) : (
                <EmptyState icon={FileText} title="No materials yet" description="Study materials will be added soon" />
              )}
            </CardContent>
          </Card>

          {/* Recorded Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recorded Videos</CardTitle>
              <CardDescription>Lesson recordings</CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules?.some(m => m.lessons?.some(l => l.videoUrl)) ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {course.modules.map((module) =>
                    module.lessons?.filter(l => l.videoUrl).map((lesson) => (
                      <div key={lesson._id} className="group relative aspect-video rounded-lg bg-muted overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                          <Play className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                          <p className="text-xs text-white/80">{lesson.duration}min</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <EmptyState icon={Video} title="No recorded videos" description="No video recordings available" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assignments</CardTitle>
              <CardDescription>Course assignments and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={FileText}
                title="No assignments yet"
                description={isTrainer ? 'Create assignments for this course' : 'No assignments have been posted yet'}
                actionLabel={isTrainer ? 'Create Assignment' : undefined}
                onAction={isTrainer ? () => {} : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assessments</CardTitle>
              <CardDescription>Tests and quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={BookOpen}
                title="No assessments yet"
                description={isTrainer ? 'Create assessments for this course' : 'No assessments have been posted yet'}
                actionLabel={isTrainer ? 'Create Assessment' : undefined}
                onAction={isTrainer ? () => {} : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab (Trainer only) */}
        {isTrainer && (
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Enrolled Students</CardTitle>
                  <CardDescription>{(course as any).enrollmentCount ?? course.enrolledCount ?? 0} students enrolled</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={Users}
                  title="No students enrolled"
                  description="Students will appear here once they enroll"
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
