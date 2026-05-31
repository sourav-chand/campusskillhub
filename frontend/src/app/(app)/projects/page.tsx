'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchInput } from '@/components/shared/search-input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { projectService } from '@/services/project.service';
import {
  FolderKanban,
  Plus,
  Github,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  MessageSquare,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Project, ProjectMilestone } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  not_started: { label: 'Not Started', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  on_hold: { label: 'On Hold', variant: 'destructive' },
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('minor');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const { page, setPage, limit: pageSize } = usePagination(1, 12);

  const minorProjects = projects.filter((p) => p.title.toLowerCase().includes('minor') || p.title.toLowerCase().includes('mini'));
  const majorProjects = projects.filter((p) => !minorProjects.includes(p));

  const fetchProjects = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: pageSize };
      if (searchQuery) params.search = searchQuery;

      const res = await projectService.getAll(params);
      setProjects(res.data.data || []);
      setTotalItems(res.data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openDetail = async (project: Project) => {
    try {
      const res = await projectService.getById(project._id);
      setSelectedProject(res.data.data);
      setDetailOpen(true);
    } catch {
      setSelectedProject(project);
      setDetailOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage minor and major projects</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>

      <SearchInput
        placeholder="Search projects..."
        onSearch={(q) => { setSearchQuery(q); setPage(1); }}
        className="w-full sm:w-96"
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : loading ? (
        <LoadingSpinner size="lg" text="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get started"
          actionLabel="Create Project"
          onAction={() => window.location.href = '/projects/new'}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="minor">Minor Projects</TabsTrigger>
            <TabsTrigger value="major">Major Projects</TabsTrigger>
          </TabsList>

          {['minor', 'major'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(tab === 'minor' ? minorProjects : majorProjects).length > 0 ? (
                  (tab === 'minor' ? minorProjects : majorProjects).map((project) => {
                    const config = statusConfig[project.status] || statusConfig.not_started;
                    const progress = project.milestones?.length
                      ? Math.round(
                          (project.milestones.filter((m) => m.status === 'completed').length /
                            project.milestones.length) *
                            100
                        )
                      : 0;

                    return (
                      <Card
                        key={project._id}
                        className="group cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => openDetail(project)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <FolderKanban className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant={config.variant}>{config.label}</Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.students?.length || 0} students</span>
                          </div>
                          {project.milestones && project.milestones.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            {project.githubUrl && (
                              <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            {project.demoUrl && (
                              <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      icon={FolderKanban}
                      title={`No ${tab} projects`}
                      description={`No ${tab} projects found`}
                      actionLabel="Create Project"
                      onAction={() => window.location.href = '/projects/new'}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* Project Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedProject ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={(statusConfig[selectedProject.status] || statusConfig.not_started).variant}>
                    {(statusConfig[selectedProject.status] || statusConfig.not_started).label}
                  </Badge>
                  {selectedProject.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {selectedProject.demoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Milestones</h4>
                  {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProject.milestones.map((milestone) => (
                        <div key={milestone._id} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${
                                milestone.status === 'completed' ? 'bg-emerald-500' :
                                milestone.status === 'in_progress' ? 'bg-amber-500' :
                                'bg-muted-foreground'
                              }`} />
                              <span className="text-sm font-medium">{milestone.title}</span>
                            </div>
                            <Badge variant={
                              milestone.status === 'completed' ? 'success' :
                              milestone.status === 'in_progress' ? 'warning' :
                              'secondary'
                            } className="capitalize text-xs">
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground mt-1 ml-4">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 ml-4 text-xs text-muted-foreground">
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                            {milestone.completedAt && <span>Completed: {formatDate(milestone.completedAt)}</span>}
                          </div>

                          {/* Feedback */}
                          {milestone.feedback && milestone.feedback.length > 0 && (
                            <div className="mt-2 ml-4 space-y-1">
                              {milestone.feedback.map((fb) => (
                                <div key={fb._id} className="flex items-start gap-2 rounded bg-muted/50 p-2">
                                  <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-xs">{fb.comment}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Rating: {fb.rating}/5 - {typeof fb.mentor === 'string' ? fb.mentor : fb.mentor?.name || 'Mentor'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No milestones defined</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <LoadingSpinner text="Loading details..." />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
