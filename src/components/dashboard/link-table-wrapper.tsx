'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { LinkTable } from '@/components/dashboard/link-table';
import { useApp } from '@/components/providers/app-provider';

export function LinkTableWrapper({ links }: { links: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <>
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Tautan Anda' : 'Your links'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Kelola, analisis, dan bagikan URL pendek Anda' : 'Manage, analyze, and share your shortened URLs'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <LinkTable links={links} />
      </FadeIn>
    </>
  );
}