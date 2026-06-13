'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/components/providers/app-provider';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface NavbarProps {
  siteName?: string;
  siteTagline?: string;
  logoUrl?: string;
  contactEmail?: string;
}

export function Navbar({ siteName = 'godl.ink', siteTagline = 'by Goden Creative', logoUrl, contactEmail }: NavbarProps) {
  const { theme, setTheme, locale, setLocale } = useApp();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = translations[locale].nav;
  const dashboardHref = session?.user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/links';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = session
    ? [
        { href: '/', label: 'HOME' },
        { href: '/about', label: 'ABOUT' },
        { href: dashboardHref, label: nav.dashboard.toUpperCase() }
      ]
    : [
        { href: '/', label: 'HOME' },
        { href: '/about', label: 'ABOUT' },
        { href: '/features', label: nav.features.toUpperCase() },
        { href: '/marketing/pricing', label: nav.pricing.toUpperCase() }
      ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/10 bg-background/90 shadow-lg shadow-black/20 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={siteName} width={20} height={20} className="h-5 w-5 object-contain" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </motion.div>
            <div>
              <p className="text-sm font-bold tracking-tight">{siteName}</p>
              <p className="text-[10px] text-muted-foreground">{siteTagline}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {pathname === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
              title={nav.language}
            >
              <Globe className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
              title={theme === 'dark' ? nav.light : nav.dark}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>

            {session ? (
              <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                {nav.logout.toUpperCase()}
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/auth/login">{nav.login.toUpperCase()}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">{nav.register.toUpperCase()}</Link>
                </Button>
              </>
            )}
          </div>

          {!isDashboard && (
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex flex-col bg-background p-6 pt-[max(1.5rem,env(safe-area-inset-top))]"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="font-bold">{siteName}</p>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-4 text-lg font-medium hover:bg-white/5 min-h-[48px] flex items-center"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                <button
                  onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 text-sm min-h-[48px]"
                >
                  <Globe className="h-4 w-4" /> {locale === 'en' ? 'Indonesia' : 'English'}
                </button>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 text-sm min-h-[48px]"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? nav.light : nav.dark}
                </button>
              </div>
              {session ? (
                <Button onClick={() => signOut({ callbackUrl: '/' })} className="h-12">{nav.logout.toUpperCase()}</Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="h-12"><Link href="/auth/login" onClick={() => setMobileOpen(false)}>{nav.login.toUpperCase()}</Link></Button>
                  <Button asChild className="h-12"><Link href="/auth/register" onClick={() => setMobileOpen(false)}>{nav.register.toUpperCase()}</Link></Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
