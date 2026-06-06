'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Box, Globe2, Layers, Link2, MessageSquare, Settings, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

export function Sidebar({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const pathname = usePathname();
  const isAdmin = user.role === 'ADMIN';

  const userNav = [
    { href: '/dashboard/links', label: id ? 'Tautan' : 'Links', icon: Link2 },
    { href: '/dashboard/analytics', label: id ? 'Analitik' : 'Analytics', icon: BarChart3 },
    { href: '/dashboard/domains', label: id ? 'Domain' : 'Domains', icon: Globe2 },
    { href: '/dashboard/api-docs', label: id ? 'Dokumentasi API' : 'API Docs', icon: BookOpen },
    { href: '/dashboard/settings', label: id ? 'Pengaturan' : 'Settings', icon: Settings }
  ];

  const adminNav = [
    { href: '/dashboard/admin', label: id ? 'Ikhtisar' : 'Overview', icon: ShieldCheck },
    { href: '/dashboard/admin/settings', label: id ? 'CMS Situs' : 'Site CMS', icon: Layers },
    { href: '/dashboard/admin/plans', label: id ? 'Paket' : 'Plans', icon: Box },
    { href: '/dashboard/admin/users', label: id ? 'Pengguna' : 'Users', icon: Users },
    { href: '/dashboard/admin/tickets', label: id ? 'Tiket' : 'Tickets', icon: MessageSquare }
  ];

  function NavItem({ href, label, icon: Icon, active }: any) {
    return (
      <Link
        href={href}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary/10 text-primary shadow-lg shadow-primary/10'
            : 'text-muted-foreground hover:translate-x-1 hover:bg-white/5 hover:text-foreground'
        )}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-primary"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          />
        )}
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-64 flex-col border-r border-white/10 bg-card/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold">{id ? 'Ruang kerja' : 'Workspace'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{id ? 'Akun' : 'Account'}</p>
        {userNav.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}

        {isAdmin && (
          <>
            <p className="mt-6 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{id ? 'Admin' : 'Admin'}</p>
            {adminNav.map((item) => (
              <NavItem key={item.href} {...item} active={pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href))} />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/[0.03] p-3">
          <p className="truncate text-sm font-medium">{user.name || (id ? 'Pengguna' : 'User')}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}