'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/components/providers/app-provider';
import { LinkResultCard, type LinkResult } from '@/components/links/link-result-card';

interface CreateLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLinkModal({ open, onOpenChange }: CreateLinkModalProps) {
  const { locale } = useApp();
  const id = locale === 'id';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: form.get('target'),
        slug: form.get('slug') || undefined,
        description: form.get('description') || undefined,
        password: form.get('password') || undefined,
        expiresAt: form.get('expiresAt') || undefined
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || (id ? 'Gagal membuat tautan' : 'Failed to create link'));
      return;
    }

    setResult(data);
    toast.success(id ? 'Tautan berhasil dibuat' : 'Link created successfully');
    router.refresh();
  }

  function handleClose() {
    setResult(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{id ? 'Buat tautan baru' : 'Create new link'}</DialogTitle>
          <DialogDescription>
            {id
              ? 'Free plan dibatasi 3 link aktif, tanpa slug kustom, dengan masa aktif 90 hari.'
              : 'Free plan is limited to 3 active links, no custom slug, with 90-day validity.'}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <LinkResultCard result={result} compact />
            <Button onClick={handleClose} className="w-full">{id ? 'Selesai' : 'Done'}</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="target" className="text-sm font-medium">{id ? 'URL tujuan' : 'Destination URL'}</label>
              <Input id="target" name="target" type="url" placeholder="https://example.com/long-url" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">{id ? 'Slug kustom (Pro/Team)' : 'Custom slug (Pro/Team)'}</label>
              <Input id="slug" name="slug" placeholder="my-link" />
              <p className="text-xs text-muted-foreground">
                {id ? 'Free plan otomatis memakai kode 4 karakter.' : 'Free plan automatically uses a 4-character code.'}
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">{id ? 'Deskripsi (opsional)' : 'Description (optional)'}</label>
              <Input id="description" name="description" placeholder={id ? 'Tautan kampanye untuk...' : 'Campaign link for...'} />
            </div>
            <details className="rounded-lg border border-white/10 p-3">
              <summary className="cursor-pointer text-sm font-medium">{id ? 'Opsi lanjutan' : 'Advanced options'}</summary>
              <div className="mt-3 space-y-3">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">{id ? 'Password (opsional)' : 'Password (optional)'}</label>
                  <Input id="password" name="password" type="password" placeholder={id ? 'Lindungi dengan password' : 'Protect with password'} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="expiresAt" className="text-sm font-medium">{id ? 'Kedaluwarsa pada (opsional)' : 'Expires at (optional)'}</label>
                  <Input id="expiresAt" name="expiresAt" type="datetime-local" />
                </div>
              </div>
            </details>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {id ? 'Membuat...' : 'Creating...'}</> : (id ? 'Buat tautan' : 'Create link')}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
