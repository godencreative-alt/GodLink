'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

export function AdminOverviewClient({ users, links, clicks, tickets }: { users: number; links: number; clicks: number; tickets: number }) {
  const { locale } = useApp();
  const id = locale === 'id';

  const sections = id
    ? [
        { href: '/dashboard/admin/settings', label: 'Pengaturan situs', desc: 'Logo, favicon, teks homepage, banner login, SEO, footer, kontak.' },
        { href: '/dashboard/admin/plans', label: 'Paket', desc: 'Kelola nama paket, deskripsi, ikon, harga, dan batas fitur.' },
        { href: '/dashboard/admin/users', label: 'Pengguna', desc: 'Kelola nama pengguna, email, password, role, dan paket pengguna.' },
        { href: '/dashboard/admin/tickets', label: 'Tiket', desc: 'Balas tiket dukungan dan ubah statusnya.' }
      ]
    : [
        { href: '/dashboard/admin/settings', label: 'Site Settings', desc: 'Logo, favicon, homepage text, login banners, SEO, footer, contact.' },
        { href: '/dashboard/admin/plans', label: 'Plans', desc: 'Manage plan names, descriptions, icons, prices, and feature limits.' },
        { href: '/dashboard/admin/users', label: 'Users', desc: 'Manage user name, email, password, role, and assigned plan.' },
        { href: '/dashboard/admin/tickets', label: 'Tickets', desc: 'Reply to support tickets and update their status.' }
      ];

  const stats = id
    ? [['Pengguna', users], ['Tautan', links], ['Klik', clicks], ['Tiket terbuka', tickets]]
    : [['Users', users], ['Links', links], ['Clicks', clicks], ['Open tickets', tickets]];

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Pusat kontrol admin' : 'Admin control center'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Kelola branding, paket, pengguna, tiket, dan konten inti website.' : 'Manage branding, plans, users, tickets, and core website content.'}</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid gap-4 md:grid-cols-4" staggerDelay={0.08}>
        {stats.map(([label, value]) => (
          <StaggerItem key={label as string}>
            <HoverCard>
              <Card className="border-white/10">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-bold">{value}</p>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" staggerDelay={0.1}>
        {sections.map((section) => (
          <StaggerItem key={section.href}>
            <HoverCard>
              <Link href={section.href}>
                <Card className="h-full border-white/10 transition hover:border-primary/40 hover:bg-primary/5">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold">{section.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}