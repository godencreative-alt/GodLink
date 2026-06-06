'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, BookOpen, Box, Globe, Globe2, Layers, Link2, LogOut, Menu, MessageSquare, Moon, Settings, ShieldCheck, Sparkles, Sun, Users, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

export function MobileSidebar({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
  const { locale, setLocale, theme, setTheme } = useApp();
  const id = locale === 'id';
  const pathname = usePathname();
  const isAdmin = user.role === 'ADMIN';
  const [open, setOpen] = useState(false);

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

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary"
      >
        <Menu className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-card/95 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{id ? 'Ruang kerja' : 'Workspace'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close navigation">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{id ? 'Akun' : 'Account'}</p>
                {userNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      pathname === href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                ))}

                {isAdmin && (
                  <>
                    <p className="mt-6 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
                    {adminNav.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                          pathname === href || (href !== '/dashboard/admin' && pathname.startsWith(href))
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>

              <div className="border-t border-white/10 p-4 space-y-3">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="truncate text-sm font-medium">{user.name || (id ? 'Pengguna' : 'User')}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs"
                  >
                    <Globe className="h-4 w-4" /> {locale === 'en' ? 'ID' : 'EN'}
                  </button>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/30 py-2.5 text-xs text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> {id ? 'Keluar' : 'Sign out'}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
