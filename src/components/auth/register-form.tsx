'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/components/providers/app-provider';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useApp();
  const id = locale === 'id';
  const [loading, setLoading] = useState(false);
  const selectedPlanId = searchParams.get('plan') || '';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        planId: selectedPlanId || undefined
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || (id ? 'Pendaftaran gagal' : 'Registration failed'));
      return;
    }

    toast.success(id ? 'Akun dibuat! Silakan masuk.' : 'Account created! Please sign in.');
    router.push('/auth/login');
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{id ? 'Buat akun Anda' : 'Create your account'}</CardTitle>
        <CardDescription>{id ? 'Mulai memperpendek tautan dengan godl.ink' : 'Start shortening links with godl.ink'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">{id ? 'Nama' : 'Name'}</label>
            <Input id="name" name="name" placeholder={id ? 'Nama Anda' : 'Your name'} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">{id ? 'Password' : 'Password'}</label>
            <Input id="password" name="password" type="password" placeholder="••••••••" minLength={8} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (id ? 'Membuat...' : 'Creating...') : (id ? 'Buat akun' : 'Create account')}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {id ? 'Sudah punya akun?' : 'Already have an account?'} <Link href="/auth/login" className="text-primary hover:underline">{id ? 'Masuk' : 'Sign in'}</Link>
        </div>
      </CardContent>
    </Card>
  );
}