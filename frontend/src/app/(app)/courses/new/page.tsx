'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { courseService } from '@/services/course.service';
import { ChevronLeft, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.coerce.number().int().positive('Duration must be positive'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater').default(0),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  collegeId: z.string().optional().or(z.literal('')),
  trainerId: z.string().min(1, 'Trainer ID is required'),
  tags: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
});

type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

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

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');
  const [prereqInput, setPrereqInput] = React.useState('');

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: 0,
      price: 0,
      thumbnail: '',
      collegeId: (user as any)?.collegeId || (user as any)?.college || '',
      trainerId: '',
      tags: [],
      prerequisites: [],
      learningObjectives: [],
    },
  });

  const tags = form.watch('tags') || [];
  const prerequisites = form.watch('prerequisites') || [];
  const learningObjectives = form.watch('learningObjectives') || [];

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

  const onSubmit = async (values: CreateCourseFormValues) => {
    try {
      setSubmitting(true);
      const payload: Record<string, unknown> = {
        ...values,
        collegeId: values.collegeId || undefined,
        shortDescription: values.shortDescription || undefined,
        thumbnail: values.thumbnail || undefined,
        tags: values.tags?.length ? values.tags : undefined,
        prerequisites: values.prerequisites?.length ? values.prerequisites : undefined,
        learningObjectives: values.learningObjectives?.length ? values.learningObjectives : undefined,
      };
      const res = await courseService.create(payload as Record<string, unknown>);
      toast.success('Course created successfully');
      const courseId = res.data.data?._id || (res.data.data as any)?.id;
      if (courseId) {
        router.push(`/courses/${courseId}`);
      } else {
        router.push('/courses');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/courses">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Course</h1>
            <p className="text-sm text-muted-foreground">Fill in the details to create a new course</p>
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
                      <FormLabel>College ID</FormLabel>
                      <FormControl>
                        <Input placeholder="College UUID" {...field} />
                      </FormControl>
                      <FormDescription>Optional. Leave blank to use your college</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trainerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trainer ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Trainer UUID" {...field} />
                      </FormControl>
                      <FormDescription>Your trainer profile identifier</FormDescription>
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
              <Link href="/courses">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
