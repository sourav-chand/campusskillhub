'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { courseService } from '@/services/course.service';
import { collegeService } from '@/services/college.service';
import { userService } from '@/services/user.service';
import { ChevronLeft, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const editCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.coerce.number().int().positive('Duration must be positive'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater').default(0),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  collegeId: z.string().optional(),
  trainerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
});

type EditCourseFormValues = z.infer<typeof editCourseSchema>;

const categoryOptions = [
  'full_stack_development',
  'devops',
  'cloud_computing',
  'java',
  'dotnet',
  'python',
  'data_science',
  'artificial_intelligence',
  'mobile_development',
  'cybersecurity',
];

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');
  const [prereqInput, setPrereqInput] = React.useState('');
  const [colleges, setColleges] = React.useState<any[]>([]);
  const [trainers, setTrainers] = React.useState<any[]>([]);
  const [loadingData, setLoadingData] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const userRole = (user?.role || '').toLowerCase();
  const isSuperAdmin = userRole === 'super_admin';
  const isCollegeAdmin = userRole === 'admin' || userRole === 'college_admin';
  const canManageAll = isSuperAdmin || isCollegeAdmin;

  const form = useForm<EditCourseFormValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: 0,
      price: 0,
      thumbnail: '',
      collegeId: '',
      trainerId: '',
      tags: [],
      prerequisites: [],
      learningObjectives: [],
    },
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setFetchError(null);

        const [courseRes, collegesRes, usersRes] = await Promise.allSettled([
          courseService.getById(courseId),
          collegeService.getAll({ limit: 100 }),
          userService.getAll(),
        ]);

        if (collegesRes.status === 'fulfilled') {
          const data = collegesRes.value.data?.data || collegesRes.value.data || [];
          setColleges(Array.isArray(data) ? data : []);
        }

        if (usersRes.status === 'fulfilled') {
          const data = usersRes.value.data?.data || usersRes.value.data || [];
          const allUsers = Array.isArray(data) ? data : [];
          const trainerList = allUsers.filter((u: any) => {
            const role = (u.role || '').toUpperCase();
            return role === 'TRAINER' || role === 'INSTRUCTOR';
          });
          setTrainers(trainerList);
        }

        if (courseRes.status === 'fulfilled') {
          const course = courseRes.value.data.data;
          const instructorId = typeof course.instructor === 'string'
            ? course.instructor
            : course.instructor?._id || (course.instructor as any)?.id || '';

          form.reset({
            title: course.title || '',
            shortDescription: course.shortDescription || '',
            description: course.description || '',
            category: course.category || '',
            level: course.level || 'beginner',
            duration: course.duration || 0,
            price: course.price ?? 0,
            thumbnail: course.thumbnail || '',
            collegeId: (course as any).collegeId || course.college || '',
            trainerId: instructorId,
            tags: (course as any).tags || [],
            prerequisites: (course as any).prerequisites || [],
            learningObjectives: (course as any).learningObjectives || [],
          });
        } else {
          setFetchError('Failed to load course');
        }
      } catch {
        setFetchError('Failed to load course data');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [courseId, form]);

  const tags = form.watch('tags') || [];
  const prerequisites = form.watch('prerequisites') || [];

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      form.setValue('tags', [...tags, val]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    form.setValue('tags', tags.filter((t) => t !== tag));
  };

  const addPrereq = () => {
    const val = prereqInput.trim();
    if (val && !prerequisites.includes(val)) {
      form.setValue('prerequisites', [...prerequisites, val]);
      setPrereqInput('');
    }
  };

  const removePrereq = (item: string) => {
    form.setValue('prerequisites', prerequisites.filter((p) => p !== item));
  };

  const onSubmit = async (values: EditCourseFormValues) => {
    try {
      setSubmitting(true);
      const payload: Record<string, unknown> = {
        ...values,
        trainerId: values.trainerId || (user as any)?.id || (user as any)?._id,
        collegeId: values.collegeId || undefined,
        shortDescription: values.shortDescription || undefined,
        thumbnail: values.thumbnail || undefined,
        tags: values.tags?.length ? values.tags : undefined,
        prerequisites: values.prerequisites?.length ? values.prerequisites : undefined,
        learningObjectives: values.learningObjectives?.length ? values.learningObjectives : undefined,
      };
      await courseService.update(courseId, payload as Record<string, unknown>);
      toast.success('Course updated successfully');
      router.push(`/courses/${courseId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading course..." />
      </div>
    );
  }

  if (fetchError) {
    return <ErrorState message={fetchError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/courses/${courseId}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-sm text-muted-foreground">Update the course details</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Course title, description, and category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief summary (max 300 chars)" className="resize-none" rows={2} {...field} />
                    </FormControl>
                    <FormDescription>Displayed in course cards</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed course description" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="e.g. 40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="0.01" placeholder="0 for free" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Optional URL for course thumbnail image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags & Prerequisites</CardTitle>
              <CardDescription>Add tags and prerequisites for the course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a tag and press Add"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  />
                  <Button type="button" variant="outline" onClick={addTag} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <FormLabel>Prerequisites</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {prerequisites.map((pr) => (
                    <Badge key={pr} variant="secondary" className="gap-1">
                      {pr}
                      <button type="button" onClick={() => removePrereq(pr)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a prerequisite and press Add"
                    value={prereqInput}
                    onChange={(e) => setPrereqInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPrereq(); } }}
                  />
                  <Button type="button" variant="outline" onClick={addPrereq} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>College and trainer assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="collegeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a college" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colleges
                            .filter((c: any) => c.isActive !== false)
                            .map((college: any) => (
                              <SelectItem key={college.id || college._id} value={college.id || college._id}>
                                {college.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Optional. Leave blank for no college</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trainerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trainer</FormLabel>
                      {canManageAll ? (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trainer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {trainers.map((t: any) => {
                              const tid = t.id || t._id;
                              const tName = t.firstName && t.lastName
                                ? `${t.firstName} ${t.lastName}`
                                : t.name || t.email || tid;
                              return (
                                <SelectItem key={tid} value={tid}>
                                  {tName}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-muted-foreground py-2">
                          You are assigned as the trainer for this course
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" asChild>
              <Link href={`/courses/${courseId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
