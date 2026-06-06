'use client';

import { FadeIn } from '@/components/ui/animations';
import { ApiDocsContent } from '@/components/dashboard/api-docs-content';
import { useApp } from '@/components/providers/app-provider';

export function ApiDocsPageClient({ apiKey }: { apiKey: string | null }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Dokumentasi API' : 'API Documentation'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Gunakan API godl.ink dengan API key akun Anda.' : 'Use the godl.ink API with your account API key.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <ApiDocsContent apiKey={apiKey} />
      </FadeIn>
    </div>
  );
}