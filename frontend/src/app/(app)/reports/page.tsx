'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { BarChart, LineChart, PieChart } from '@/components/shared/charts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { reportService } from '@/services/report.service';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  CalendarDays,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const reportTypes = [
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Student attendance records and statistics',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Student academic performance and grades',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    id: 'assessment',
    title: 'Assessment Report',
    description: 'Test and assessment result analysis',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    id: 'completion',
    title: 'Completion Report',
    description: 'Course completion rates and certificates',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState('attendance');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState('all');
  const [collegeFilter, setCollegeFilter] = React.useState('all');
  const [generated, setGenerated] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (courseFilter !== 'all') params.course = courseFilter;

      await reportService.getAttendanceReport(params);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExporting(true);
      const params: Record<string, unknown> = { type: selectedType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await reportService.exportReport(selectedType, params);
      const blob = new Blob([res.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedType}-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // handle error
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export platform reports</p>
      </div>

      {/* Report Type Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              'cursor-pointer transition-all hover:ring-2 hover:ring-primary/20',
              selectedType === type.id && 'ring-2 ring-primary',
            )}
            onClick={() => { setSelectedType(type.id); setGenerated(false); }}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', type.bgColor)}>
                <type.icon className={cn('h-5 w-5', type.color)} />
              </div>
              <div>
                <p className="font-semibold text-sm">{type.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">Course</label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="course-1">Course 1</SelectItem>
                  <SelectItem value="course-2">Course 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="space-y-2 flex-1">
                <label className="text-xs font-medium text-muted-foreground">College</label>
                <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={handleGenerate} disabled={loading} className="gap-2">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <ErrorState message={error} onRetry={handleGenerate} />}

      {/* Preview */}
      {generated && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Report Preview</h2>
              <p className="text-sm text-muted-foreground capitalize">{selectedType} report</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)} className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={exporting} className="gap-2">
                <Printer className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')} disabled={exporting} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base capitalize">{selectedType} Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { label: 'Week 1', value: 85 },
                  { label: 'Week 2', value: 78 },
                  { label: 'Week 3', value: 92 },
                  { label: 'Week 4', value: 88 },
                  { label: 'Week 5', value: 95 },
                ]}
                xKey="label"
                bars={[{ key: 'value', name: 'Score', color: '#3b82f6' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </>
      )}

      {!generated && !loading && (
        <EmptyState
          icon={BarChart3}
          title="No report generated"
          description="Select filters and generate a report to preview"
        />
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">{selectedType} Report</DialogTitle>
            <DialogDescription>
              {startDate && endDate ? `${startDate} to ${endDate}` : 'All time'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">87%</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">12</p>
                <p className="text-xs text-muted-foreground">Exceptions</p>
              </div>
            </div>
            <BarChart
              data={[
                { label: 'Week 1', value: 85 },
                { label: 'Week 2', value: 78 },
                { label: 'Week 3', value: 92 },
                { label: 'Week 4', value: 88 },
                { label: 'Week 5', value: 95 },
              ]}
              xKey="label"
              bars={[{ key: 'value', name: 'Score', color: '#3b82f6' }]}
              height={250}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
