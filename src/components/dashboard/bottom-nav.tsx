'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Globe2, Link2, MoreHorizontal, Plus, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';
import { useCreateLink } from '@/components/dashboard/dashboard-shell';
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar';

type DashboardUser = { name?: string | null; email?: string | null; role?: string };

export function BottomNav({ user }: { user: DashboardUser }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const pathname = usePathname();
  const { openCreate } = useCreateLink();
  const [moreOpen, setMoreOpen] = useState(false);
  const isAdmin = user.role === 'ADMIN';

  const left = [
    { href: '/dashboard/links', label: id ? 'Tautan' : 'Links', icon: Link2 },
    { href: '/dashboard/analytics', label: id ? 'Analitik' : 'Analytics', icon: BarChart3 }
  ];

  const right = isAdmin
    ? [{ href: '/dashboard/admin', label: 'Admin', icon: ShieldCheck }]
    : [{ href: '/dashboard/domains', label: id ? 'Domain' : 'Domains', icon: Globe2 }];

  function Item({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Link2 }) {
    const active = pathname === href || (href !== '/dashboard/admin' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] transition-colors',
          active ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-medium">{label}</span>
        {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
      </Link>
    );
  }

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-white/10 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        {left.map((item) => (
          <div key={item.href} className="relative flex flex-1">
            <Item {...item} />
          </div>
        ))}

        <div className="flex flex-1 items-start justify-center">
          <button
            onClick={openCreate}
            aria-label={id ? 'Tautan baru' : 'New link'}
            className="-mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {right.map((item) => (
          <div key={item.href} className="relative flex flex-1">
            <Item {...item} />
          </div>
        ))}

        <button
          onClick={() => setMoreOpen(true)}
          aria-label={id ? 'Menu lainnya' : 'More menu'}
          className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] text-muted-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] font-medium">{id ? 'Lainnya' : 'More'}</span>
        </button>
      </nav>

      <MobileSidebar user={user} open={moreOpen} onOpenChange={setMoreOpen} hideTrigger />
    </>
  );
}
