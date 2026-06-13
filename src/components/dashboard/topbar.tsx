'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateLink } from '@/components/dashboard/dashboard-shell';
import { useApp } from '@/components/providers/app-provider';

interface TopBarProps {
  user: { name?: string | null; email?: string | null };
}

export function TopBar({ user }: TopBarProps) {
  const { locale } = useApp();
  const id = locale === 'id';
  const { openCreate } = useCreateLink();

  return (
    <header className="sticky top-16 z-20 hidden h-14 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:flex">
      <div className="truncate text-sm text-muted-foreground">
        {id ? 'Selamat datang kembali,' : 'Welcome back,'} <span className="font-medium text-foreground">{user.name || user.email}</span>
      </div>
      <Button size="sm" onClick={openCreate} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" /> {id ? 'Tautan baru' : 'New link'}
      </Button>
    </header>
  );
}
