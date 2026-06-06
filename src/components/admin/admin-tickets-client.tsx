'use client';

import { FadeIn } from '@/components/ui/animations';
import { TicketsAdmin } from '@/components/admin/tickets-admin';
import { useApp } from '@/components/providers/app-provider';

export function AdminTicketsClient({ tickets }: { tickets: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Tiket dukungan' : 'Support tickets'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Balas tiket pengguna dan kelola statusnya.' : 'Reply to user tickets and manage status.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <TicketsAdmin tickets={tickets} />
      </FadeIn>
    </div>
  );
}