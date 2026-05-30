'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import api from '@/lib/axios';

type VerificationStatus = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    async function verify() {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(
          err instanceof Error
            ? err.message
            : 'Verification failed. The link may have expired.',
        );
      }
    }

    verify();
  }, [token]);

  return (
    <>
      <div className="mb-6 text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            status === 'loading'
              ? 'bg-muted'
              : status === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-destructive/10'
          }`}
        >
          {status === 'loading' && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {status === 'success' && <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />}
          {status === 'error' && <XCircle className="h-8 w-8 text-destructive" />}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h1>
      </div>

      <Alert
        variant={
          status === 'success' ? 'success' : status === 'error' ? 'destructive' : 'default'
        }
      >
        {status === 'success' && <CheckCircle2 className="h-4 w-4" />}
        {status === 'error' && <XCircle className="h-4 w-4" />}
        {status === 'loading' && <Mail className="h-4 w-4" />}
        <AlertDescription>{message || 'Please wait while we verify your email...'}</AlertDescription>
      </Alert>

      {status !== 'loading' && (
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Need a new verification link?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in to resend
            </Link>
          </p>
        </div>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
