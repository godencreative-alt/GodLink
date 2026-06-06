'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScaleIn } from '@/components/ui/animations';

export function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    async function verify() {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
        return;
      }

      setStatus('success');
      setMessage('Email verified successfully');
      setTimeout(() => router.push('/auth/login'), 3000);
    }

    verify();
  }, [searchParams, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <ScaleIn>
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <CardTitle className="mt-4">Verifying email</CardTitle>
                <CardDescription>Please wait while we verify your email address</CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className="mt-4">Email verified</CardTitle>
                <CardDescription>Your account is now active. Redirecting to login...</CardDescription>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <CardTitle className="mt-4">Verification failed</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {status === 'error' && (
              <Button asChild>
                <Link href="/auth/register">Try again</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </ScaleIn>
    </main>
  );
}