'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/components/providers/app-provider';
import { LinkResultCard, type LinkResult } from '@/components/links/link-result-card';

const metrics = {
  en: (count: number | null): [string, string][] => [
    ['Short Chars', 'Auto short code'],
    ['30 days', 'Guest link + QR'],
    [count === null ? '—' : count.toLocaleString('en-US'), 'Links generated']
  ],
  id: (count: number | null): [string, string][] => [
    ['Karakter Pendek', 'Kode otomatis'],
    ['30 hari', 'Link + QR tamu'],
    [count === null ? '—' : count.toLocaleString('id-ID'), 'Link dibuat']
  ]
};

export default function LandingPage() {
  const { locale } = useApp();
  const id = locale === 'id';
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<LinkResult | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [totalLinks, setTotalLinks] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => {});
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setTotalLinks(data.totalLinks))
      .catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: url })
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || (id ? 'Gagal membuat tautan' : 'Could not create link'));
      return;
    }

    setResult(data);
    toast.success(id ? 'Tautan dan QR Code siap' : 'Your link and QR Code are ready');
  }

  const badgeText = settings?.homeBadgeText || (id ? 'Didukung oleh Goden Creative' : 'Powered by Goden Creative');
  const title = settings?.homeTitle || (id ? 'Tautan pendek 4 karakter, cepat, dan siap QR.' : '4-character short links, fast and QR-ready.');
  const subtitle = settings?.homeSubtitle || (id ? 'Tamu bisa membuat 2 link per IP dengan QR Code dan masa aktif 30 hari. Daftar gratis agar link bertahan 90 hari.' : 'Guests can create 2 links per IP with QR Code and 30-day validity. Register free to keep links for 90 days.');

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="absolute left-1/2 top-1/4 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-3xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary"
        >
          <Sparkles className="h-4 w-4" /> {badgeText}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-balance text-5xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
        >
          {subtitle}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onSubmit={handleCreate}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder={id ? 'Tempel URL panjang, mis. https://godentopup.com/produk/...' : 'Paste a long URL, e.g. https://godentopup.com/product/...'}
              className="h-12 flex-1 border-white/10 bg-black/30 text-base placeholder:text-muted-foreground/60"
            />
            <Button className="h-12 rounded-xl px-6 text-base font-semibold" type="submit">
              {id ? 'Buat link + QR' : 'Create link + QR'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {result && <LinkResultCard result={result} />}
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3"
        >
          {metrics[locale](totalLinks).map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}