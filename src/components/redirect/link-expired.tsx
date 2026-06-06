'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScaleIn } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

export function LinkExpired() {
  const { locale } = useApp();
  const id = locale === 'id';
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <ScaleIn>
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>{id ? 'Tautan kedaluwarsa' : 'Link expired'}</CardTitle>
            <CardDescription>
              {id
                ? 'Tautan ini telah mencapai tanggal kedaluwarsa dan tidak aktif lagi.'
                : 'This link has reached its expiration date and is no longer active.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">{id ? 'Ke beranda' : 'Go home'}</Link>
            </Button>
          </CardContent>
        </Card>
      </ScaleIn>
    </main>
  );
}