'use client';

import { FadeIn } from '@/components/ui/animations';
import { DomainManager } from '@/components/dashboard/domain-manager';
import { useApp } from '@/components/providers/app-provider';

export function DomainsPageClient({ domains }: { domains: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Domain kustom' : 'Custom domains'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Hubungkan domain dan rutekan tautan pendek bermerek melalui godl.ink' : 'Connect domains and route branded short links through godl.ink'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <DomainManager domains={domains} />
      </FadeIn>
    </div>
  );
}