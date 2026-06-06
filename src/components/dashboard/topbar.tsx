'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreateLinkModal } from '@/components/dashboard/create-link-modal';
import { useApp } from '@/components/providers/app-provider';

interface TopBarProps {
  user: { name?: string | null; email?: string | null };
  mobileSidebar?: React.ReactNode;
}

export function TopBar({ user, mobileSidebar }: TopBarProps) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-16 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {mobileSidebar}
          <div className="hidden truncate text-sm text-muted-foreground sm:block">
            {id ? 'Selamat datang kembali,' : 'Welcome back,'} <span className="font-medium text-foreground">{user.name || user.email}</span>
          </div>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">{id ? 'Tautan baru' : 'New link'}</span>
        </Button>
      </header>
      <CreateLinkModal open={open} onOpenChange={setOpen} />
    </>
  );
}