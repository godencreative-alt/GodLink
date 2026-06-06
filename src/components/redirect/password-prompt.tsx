'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScaleIn } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';
import { verifyLinkPassword } from '@/app/actions/verify-password';

export function PasswordPrompt({ slug }: { slug: string }) {
  const router = useRouter();
  const { locale } = useApp();
  const id = locale === 'id';
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    startTransition(async () => {
      const result = await verifyLinkPassword(slug, pwd);
      if (result.success) {
        // Cookie is now set server-side. Re-render the server component —
        // it will see the cookie, track the click, and redirect.
        router.refresh();
      } else {
        setError(true);
      }
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <ScaleIn>
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{id ? 'Perlu kata sandi' : 'Password required'}</CardTitle>
            <CardDescription>
              {id
                ? 'Tautan ini dilindungi. Masukkan kata sandi untuk lanjut.'
                : 'This link is protected. Enter the password to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <label htmlFor="redirect-pwd" className="sr-only">
                {id ? 'Kata sandi' : 'Password'}
              </label>
              <Input
                id="redirect-pwd"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder={id ? 'Masukkan kata sandi' : 'Enter password'}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'redirect-pwd-error' : undefined}
                autoFocus
                disabled={isPending}
              />
              {error && (
                <p id="redirect-pwd-error" className="text-sm text-destructive">
                  {id ? 'Kata sandi salah' : 'Incorrect password'}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isPending || !pwd}>
                {isPending
                  ? (id ? 'Memverifikasi...' : 'Verifying...')
                  : (id ? 'Lanjut' : 'Continue')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ScaleIn>
    </main>
  );
}
