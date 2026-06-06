'use client';

import { FadeIn } from '@/components/ui/animations';
import { PlansAdmin } from '@/components/admin/plans-admin';
import { useApp } from '@/components/providers/app-provider';

export function AdminPlansClient({ plans }: { plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Paket' : 'Plans'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Kelola detail paket, ikon, batas, dan deskripsi.' : 'Manage plan details, icons, limits, and descriptions.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <PlansAdmin plans={plans} />
      </FadeIn>
    </div>
  );
}