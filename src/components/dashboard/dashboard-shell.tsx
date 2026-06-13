'use client';

import { createContext, useContext, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/topbar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { CreateLinkModal } from '@/components/dashboard/create-link-modal';
import { AdsBanner } from '@/components/ads/ads-banner';

type DashboardUser = { name?: string | null; email?: string | null; role?: string };

interface CreateLinkContextValue {
  openCreate: () => void;
}

const CreateLinkContext = createContext<CreateLinkContextValue | null>(null);

export function useCreateLink() {
  const ctx = useContext(CreateLinkContext);
  if (!ctx) throw new Error('useCreateLink must be used within DashboardShell');
  return ctx;
}

export function DashboardShell({ user, children }: { user: DashboardUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CreateLinkContext.Provider value={{ openCreate: () => setOpen(true) }}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-background">
        <Sidebar user={user} />
        <div className="flex flex-1 flex-col lg:pl-64">
          <TopBar user={user} />
          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">{children}</main>
          <AdsBanner slot="sidebar" className="px-4 pb-4 sm:px-6" />
        </div>
      </div>
      <BottomNav user={user} />
      <CreateLinkModal open={open} onOpenChange={setOpen} />
    </CreateLinkContext.Provider>
  );
}
