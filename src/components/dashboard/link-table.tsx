'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, ExternalLink, Trash2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate, getShortUrl } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

interface LinkTableProps {
  links: any[];
}

export function LinkTable({ links }: LinkTableProps) {
  const { locale } = useApp();
  const id = locale === 'id';
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function deleteLink(linkId: string) {
    if (!confirm(id ? 'Hapus tautan ini?' : 'Delete this link?')) return;
    setDeleting(linkId);
    try {
      const res = await fetch(`/api/links/${linkId}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error(id ? 'Gagal menghapus tautan' : 'Failed to delete link');
        return;
      }
      toast.success(id ? 'Tautan dihapus' : 'Link deleted');
      router.refresh();
    } catch {
      toast.error(id ? 'Kesalahan jaringan' : 'Network error');
    } finally {
      setDeleting(null);
    }
  }

  async function copyUrl(slug: string) {
    const url = getShortUrl(slug);
    await navigator.clipboard.writeText(url);
    toast.success(id ? 'Disalin ke clipboard' : 'Copied to clipboard');
  }

  function openShortUrl(slug: string) {
    window.open(getShortUrl(slug), '_blank', 'noopener,noreferrer');
  }

  function openQr(slug: string) {
    window.open(`/api/qr?slug=${encodeURIComponent(slug)}`, '_blank', 'noopener,noreferrer');
  }

  if (links.length === 0) {
    return (
      <Card className="border-white/10 p-12 text-center">
        <p className="text-muted-foreground">{id ? 'Belum ada tautan. Buat yang pertama untuk memulai.' : 'No links yet. Create your first one to get started.'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.id} className="border-white/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-semibold text-primary">{getShortUrl(link.slug)}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{link.target}</p>
              {link.description && <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>}
              <p className="mt-2 text-xs text-muted-foreground">{link._count.clicks} {id ? 'klik' : 'clicks'} • {id ? 'Dibuat' : 'Created'} {formatDate(link.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => copyUrl(link.slug)} title={id ? 'Salin' : 'Copy'}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openShortUrl(link.slug)} title={id ? 'Buka' : 'Open'}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openQr(link.slug)} title={id ? 'Buka QR' : 'Open QR'}>
                <QrCode className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteLink(link.id)}
                disabled={deleting === link.id}
                title={id ? 'Hapus' : 'Delete'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}