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