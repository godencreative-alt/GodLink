'use client';

import Link from 'next/link';
import { Copy, ExternalLink, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useApp } from '@/components/providers/app-provider';

export type LinkResult = {
  shortUrl: string;
  slug: string;
  qrUrl?: string | null;
  expiresAt?: string | Date | null;
  expiresInDays?: number | null;
  guestRemaining?: number | null;
  upgradeUrl?: string | null;
  upgradeMessage?: string | null;
};

export function LinkResultCard({ result, compact = false }: { result: LinkResult; compact?: boolean }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const qrUrl = result.qrUrl || `/api/qr?slug=${encodeURIComponent(result.slug)}`;

  async function copyUrl() {
    await navigator.clipboard.writeText(result.shortUrl);
    toast.success(id ? 'Disalin ke clipboard' : 'Copied to clipboard');
  }

  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0B0D17] p-2">
          <img src={qrUrl} alt="QR Code" className="h-full w-full rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{id ? 'Tautan siap' : 'Link ready'}</p>
          <p className="mt-2 truncate font-mono text-sm font-semibold text-primary sm:text-base">{result.shortUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={copyUrl}>
              <Copy className="mr-2 h-4 w-4" /> {id ? 'Salin' : 'Copy'}
            </Button>
            <Button type="button" size="sm" variant="outline" asChild>
              <a href={result.shortUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> {id ? 'Buka' : 'Open'}
              </a>
            </Button>
            <Button type="button" size="sm" variant="outline" asChild>
              <a href={qrUrl} target="_blank" rel="noreferrer">
                <QrCode className="mr-2 h-4 w-4" /> QR
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        {result.expiresInDays ? (
          <p>{id ? `Berlaku selama ${result.expiresInDays} hari.` : `Valid for ${result.expiresInDays} days.`}</p>
        ) : null}
        {typeof result.guestRemaining === 'number' ? (
          <p>{id ? `Sisa generate gratis dari IP ini: ${result.guestRemaining}.` : `Free generations remaining from this IP: ${result.guestRemaining}.`}</p>
        ) : null}
        {result.upgradeMessage ? (
          <p>
            {id
              ? result.upgradeUrl === '/marketing/pricing'
                ? 'Upgrade ke Pro untuk slug kustom dan lebih banyak link.'
                : 'Daftar gratis agar link bertahan 90 hari.'
              : result.upgradeMessage}
          </p>
        ) : null}
      </div>

      {result.upgradeUrl ? (
        <Button asChild className="mt-4 w-full" variant={compact ? 'outline' : 'default'}>
          <Link href={result.upgradeUrl}>{id ? 'Jadi member gratis' : 'Become a member'}</Link>
        </Button>
      ) : null}
    </div>
  );
}