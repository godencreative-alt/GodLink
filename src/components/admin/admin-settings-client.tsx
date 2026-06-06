'use client';

import { FadeIn } from '@/components/ui/animations';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';
import { useApp } from '@/components/providers/app-provider';

export function AdminSettingsClient({ settings }: { settings: any }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Pengaturan situs' : 'Site settings'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Ubah logo, favicon, homepage, halaman login, SEO, footer, dan kontak.' : 'Change logo, favicon, homepage, login page, SEO, footer, and contact details.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <SiteSettingsForm settings={settings} />
      </FadeIn>
    </div>
  );
}