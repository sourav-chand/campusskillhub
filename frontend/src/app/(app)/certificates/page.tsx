'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { certificateService } from '@/services/certificate.service';
import {
  Award,
  Download,
  Search,
  ShieldCheck,
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Certificate } from '@/types';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [verifyId, setVerifyId] = React.useState('');
  const [verifyResult, setVerifyResult] = React.useState<{ valid: boolean; certificate?: Certificate } | null>(null);
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [verifyOpen, setVerifyOpen] = React.useState(false);
  const { page, setPage, limit: pageSize } = usePagination(1, 12);

  const isSuperAdmin = user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  const fetchCertificates = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = isStudent
        ? await certificateService.getMyCertificates({ page, limit: pageSize })
        : await certificateService.getAll({ page, limit: pageSize });
      setCertificates(res.data.data ?? []);
      setTotalItems((res.data as any).meta?.total ?? res.data.pagination?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, isStudent]);

  React.useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleVerify = async () => {
    if (!verifyId.trim()) return;
    try {
      setVerifyLoading(true);
      const res = await certificateService.verify(verifyId);
      setVerifyResult(res.data.data);
    } catch {
      setVerifyResult({ valid: false });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDownload = async (certId: string) => {
    try {
      const res = await certificateService.download(certId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // handle error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
          <p className="text-sm text-muted-foreground">
            {isStudent ? 'Your earned certificates' : 'Manage certificates'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setVerifyOpen(true)} className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Verify Certificate
          </Button>
          {isSuperAdmin && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Manage Templates
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchCertificates} />
      ) : loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading certificates..." />
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description={isStudent ? 'Complete courses to earn certificates' : 'No certificates have been issued'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificates.map((cert) => (
            <Card key={cert._id} className="group">
              <CardContent className="p-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold truncate">
                    {typeof cert.course === 'string' ? cert.course : cert.course?.title || 'Course'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Issued: {formatDate(cert.issuedAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {cert.certificateId}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    Grade: {cert.grade}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Score: {cert.totalScore}%
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleDownload(cert._id)}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* Verify Dialog */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Certificate</DialogTitle>
            <DialogDescription>
              Enter the certificate ID to verify its authenticity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter certificate ID..."
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <Button onClick={handleVerify} disabled={verifyLoading}>
                <Search className="mr-2 h-4 w-4" />
                Verify
              </Button>
            </div>

            {verifyLoading && <LoadingSpinner size="sm" text="Verifying..." />}

            {verifyResult && (
              <div className={`rounded-lg border p-4 ${
                verifyResult.valid ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20'
              }`}>
                <div className="flex items-center gap-2">
                  {verifyResult.valid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-600">Valid Certificate</p>
                        {verifyResult.certificate && (
                          <p className="text-sm text-muted-foreground">
                            Issued to {typeof verifyResult.certificate.student === 'string' ? verifyResult.certificate.student : verifyResult.certificate.student?.name} for{' '}
                            {typeof verifyResult.certificate.course === 'string' ? verifyResult.certificate.course : verifyResult.certificate.course?.title}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-600">Invalid Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          No certificate found with this ID
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
