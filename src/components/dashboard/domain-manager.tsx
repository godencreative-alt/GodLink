'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

export function DomainManager({ domains }: { domains: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: form.get('hostname') })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || (id ? 'Gagal menambah domain' : 'Failed to add domain'));
        return;
      }

      toast.success(id ? 'Domain ditambahkan' : 'Domain added');
      router.refresh();
    } catch {
      toast.error(id ? 'Kesalahan jaringan' : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">{id ? 'Tambah domain' : 'Add domain'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input name="hostname" placeholder="links.yourdomain.com" required />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? (id ? 'Menambahkan...' : 'Adding...') : (id ? 'Tambah domain' : 'Add domain')}</Button>
          </form>
          <div className="mt-6 rounded-xl bg-white/[0.03] p-4 text-sm text-muted-foreground">
            {id ? 'Arahkan CNAME record ke ' : 'Point a CNAME record to '}<span className="font-mono text-primary">godl.ink</span>{id ? ', lalu verifikasi dari halaman ini setelah DNS aktif.' : ', then verify from this page after DNS propagates.'}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {domains.length === 0 ? (
          <Card className="border-white/10 p-10 text-center text-muted-foreground">{id ? 'Belum ada domain kustom.' : 'No custom domains yet.'}</Card>
        ) : (
          domains.map((domain) => (
            <Card key={domain.id} className="border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{domain.hostname}</p>
                    <p className="text-xs text-muted-foreground">{id ? 'Ditambahkan' : 'Added'} {formatDate(domain.createdAt)}</p>
                  </div>
                </div>
                <span className={domain.verified ? 'text-sm text-green-400' : 'text-sm text-yellow-400'}>
                  {domain.verified ? (id ? 'Terverifikasi' : 'Verified') : (id ? 'Menunggu' : 'Pending')}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}