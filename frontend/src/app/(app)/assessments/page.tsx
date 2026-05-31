'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { assessmentService } from '@/services/assessment.service';
import {
  FileQuestion,
  Code2,
  Clock,
  Plus,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import type { MCQTest, CodingAssessment } from '@/types';

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mcqTests, setMcqTests] = React.useState<MCQTest[]>([]);
  const [codingAssessments, setCodingAssessments] = React.useState<CodingAssessment[]>([]);
  const [mcqTotal, setMcqTotal] = React.useState(0);
  const [codingTotal, setCodingTotal] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('mcq');
  const { page, setPage, limit: pageSize } = usePagination(1, 10);

  const isTrainer = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [mcqRes, codingRes] = await Promise.allSettled([
        assessmentService.getMCQTests({ page, limit: pageSize }),
        assessmentService.getCodingAssessments({ page, limit: pageSize }),
      ]);

      if (mcqRes.status === 'fulfilled') {
        setMcqTests(mcqRes.value.data.data);
        setMcqTotal(mcqRes.value.data.pagination.total);
      }
      if (codingRes.status === 'fulfilled') {
        setCodingAssessments(codingRes.value.data.data);
        setCodingTotal(codingRes.value.data.pagination.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadge = (test: MCQTest) => {
    if (!test.isPublished) return <Badge variant="warning">Draft</Badge>;
    const now = new Date();
    const createdAt = new Date(test.createdAt);
    if (now.getTime() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return <Badge variant="success">Upcoming</Badge>;
    }
    return <Badge>Completed</Badge>;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return '';
    }
  };

  if (loading && mcqTests.length === 0 && codingAssessments.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading assessments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-sm text-muted-foreground">
            {isStudent ? 'Take tests and coding challenges' : 'Create and manage assessments'}
          </p>
        </div>
        {isTrainer && (
          <Button asChild>
            <Link href="/assessments/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Link>
          </Button>
        )}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="mcq" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              MCQ Tests
            </TabsTrigger>
            <TabsTrigger value="coding" className="gap-2">
              <Code2 className="h-4 w-4" />
              Coding Assessments
            </TabsTrigger>
          </TabsList>

          {/* MCQ Tab */}
          <TabsContent value="mcq" className="space-y-4">
            {mcqTests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mcqTests.map((test) => (
                  <Link key={test._id} href={`/assessments/${test._id}`}>
                    <Card className="group h-full transition-colors hover:bg-muted/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileQuestion className="h-5 w-5 text-primary" />
                          </div>
                          {getStatusBadge(test)}
                        </div>
                        <div>
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {test.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {test.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {test.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <FileQuestion className="h-3.5 w-3.5" />
                            {test.questions?.length || 0} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3.5 w-3.5" />
                            Pass: {test.passingScore}%
                          </span>
                        </div>
                        {isStudent && (
                          <div className="flex items-center justify-between pt-1">
                            <Badge variant="outline" className="text-xs">
                              Not Attempted
                            </Badge>
                            <Button size="sm" className="gap-1">
                              Attempt
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                        {isTrainer && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button variant="outline" size="sm" className="flex-1">
                              Results
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileQuestion}
                title="No MCQ tests"
                description={isTrainer ? 'Create your first MCQ test' : 'No tests available yet'}
                actionLabel={isTrainer ? 'Create Test' : undefined}
                onAction={isTrainer ? () => {} : undefined}
              />
            )}
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(mcqTotal / pageSize)}
              totalItems={mcqTotal}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </TabsContent>

          {/* Coding Tab */}
          <TabsContent value="coding" className="space-y-4">
            {codingAssessments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {codingAssessments.map((assessment) => (
                  <Link key={assessment._id} href={`/assessments/${assessment._id}`}>
                    <Card className="group h-full transition-colors hover:bg-muted/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Code2 className="h-5 w-5 text-purple-600" />
                          </div>
                          <Badge className={cn('capitalize', getDifficultyColor(assessment.difficulty))}>
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {assessment.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {assessment.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Code2 className="h-3.5 w-3.5" />
                            {assessment.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {assessment.timeLimit} min
                          </span>
                          <span className="flex items-center gap-1">
                            <FileQuestion className="h-3.5 w-3.5" />
                            {assessment.testCases?.length || 0} tests
                          </span>
                        </div>
                        {isStudent && (
                          <Button size="sm" className="w-full gap-1">
                            Solve Challenge
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {isTrainer && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button variant="outline" size="sm" className="flex-1">
                              Submissions
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Code2}
                title="No coding assessments"
                description={isTrainer ? 'Create your first coding challenge' : 'No challenges available yet'}
                actionLabel={isTrainer ? 'Create Challenge' : undefined}
                onAction={isTrainer ? () => {} : undefined}
              />
            )}
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(codingTotal / pageSize)}
              totalItems={codingTotal}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Leaderboard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top performing students</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Trophy}
            title="No leaderboard data"
            description="Leaderboard will appear once students start taking assessments"
          />
        </CardContent>
      </Card>
    </div>
  );
}
