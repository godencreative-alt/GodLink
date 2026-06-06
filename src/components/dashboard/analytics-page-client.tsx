'use client';

import { FadeIn } from '@/components/ui/animations';
import { AnalyticsOverview } from '@/components/dashboard/analytics-overview';
import { useApp } from '@/components/providers/app-provider';

interface Props {
  totalLinks: number;
  totalClicks: number;
  byCountry: Record<string, number>;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byDay: Record<string, number>;
}

export function AnalyticsPageClient(props: Props) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Analitik' : 'Analytics'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Ikhtisar performa tautan Anda' : 'Overview of your link performance'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <AnalyticsOverview {...props} />
      </FadeIn>
    </div>
  );
}