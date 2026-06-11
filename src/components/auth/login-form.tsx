'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/components/providers/app-provider';

export function LoginForm() {
  const router = useRouter();
  const { locale } = useApp();
  const id = locale === 'id';
  const [loading, setLoading] = useState(false);

  async function getDashboardTarget() {
    try {
      const sessionRes = await fetch('/api/auth/session', { cache: 'no-store' });
      const session = await sessionRes.json();
      return session?.user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/links';
    } catch {
      return '/dashboard/links';
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false
    });

    if (!res || res.error) {
      setLoading(false);
      toast.error(id ? 'Email atau password salah. Coba lagi.' : 'Invalid email or password. Please try again.');
      return;
    }

    toast.success(id ? 'Berhasil masuk' : 'Signed in successfully');
    const target = await getDashboardTarget();
    setLoading(false);
    router.replace(target);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{id ? 'Selamat datang kembali' : 'Welcome back'}</CardTitle>
        <CardDescription>{id ? 'Masuk ke akun godl.ink Anda' : 'Sign in to your godl.ink account'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/dashboard/links' })}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C42.1 35.7 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            {id ? 'Lanjut dengan Google' : 'Continue with Google'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('github', { callbackUrl: '/dashboard/links' })}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.15 0 .31.21.67.8.56 4.57-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
            {id ? 'Lanjut dengan GitHub' : 'Continue with GitHub'}
          </Button>
        </div>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" />
          {id ? 'atau dengan email' : 'or with email'}
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">{id ? 'Password' : 'Password'}</label>
            <Input id="password" name="password" type="password" placeholder={id ? 'Masukkan password Anda' : 'Enter your password'} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {id ? 'Masuk...' : 'Signing in...'}</> : (id ? 'Masuk' : 'Sign in')}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {id ? 'Belum punya akun?' : 'No account?'}{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            {id ? 'Buat akun' : 'Create one'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}