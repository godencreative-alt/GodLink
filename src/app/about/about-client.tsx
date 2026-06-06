'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Link2,
  Mail,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

const values = [
  {
    icon: Link2,
    titleEn: 'Branded by default',
    titleId: 'Bermerek sejak awal',
    descEn: 'Every link should feel trusted, memorable, and aligned with your brand.',
    descId: 'Setiap tautan harus terasa terpercaya, mudah diingat, dan selaras dengan merek Anda.'
  },
  {
    icon: BarChart3,
    titleEn: 'Built for insight',
    titleId: 'Dirancang untuk wawasan',
    descEn: 'Track clicks, devices, countries, and campaign performance without friction.',
    descId: 'Lacak klik, perangkat, negara, dan kinerja kampanye tanpa hambatan.'
  },
  {
    icon: ShieldCheck,
    titleEn: 'Controlled by owners',
    titleId: 'Dikendalikan pemilik',
    descEn: 'Admin tools, user management, plan controls, and safer link governance.',
    descId: 'Alat admin, manajemen pengguna, kontrol paket, dan tata kelola tautan yang lebih aman.'
  },
  {
    icon: Globe2,
    titleEn: 'Ready for scale',
    titleId: 'Siap untuk skala',
    descEn: 'Custom domains, API keys, QR codes, and infrastructure that fits aaPanel deployment.',
    descId: 'Domain kustom, kunci API, kode QR, dan infrastruktur yang sesuai dengan deployment aaPanel.'
  }
];

const products = [
  {
    icon: ShoppingBag,
    name: 'GodenTopUp',
    url: 'https://godentopup.com',
    descEn: 'Best top up game, PPOB, premium apps, cloud services, and digital goods.',
    descId: 'Top up game, PPOB, aplikasi premium, layanan cloud, dan barang digital terbaik.'
  },
  {
    icon: MessageCircle,
    name: 'WhatsApp Gateway',
    url: 'https://mpwa.godentopup.com',
    descEn: 'Best unofficial WhatsApp gateway powered by MPWA for WhatsApp marketing automation.',
    descId: 'Gateway WhatsApp tidak resmi terbaik bertenaga MPWA untuk otomasi marketing WhatsApp.'
  },
  {
    icon: Mail,
    name: 'Temp Mail',
    url: 'https://tmail.godentopup.com',
    descEn: 'Disposable inbox for receiving emails without exposing your real address.',
    descId: 'Inbox sementara untuk menerima email tanpa membuka alamat asli Anda.'
  },
  {
    icon: ShieldCheck,
    name: '2FA Generate',
    url: 'https://2fa.godentopup.com',
    descEn: 'Generate TOTP two-factor codes online — no authenticator app required.',
    descId: 'Buat kode TOTP dua faktor secara online — tanpa perlu aplikasi authenticator.'
  }
];

export function AboutClient() {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 grain opacity-30" />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay={0.1}>
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" /> {id ? 'Tentang Goden Creative' : 'About Goden Creative'}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              {id ? 'Kami membangun perangkat digital yang terasa premium.' : 'We build digital tools that feel premium.'}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {id
                ? 'Goden Creative adalah studio kecil yang membangun produk-produk untuk kreator, marketer, dan operator digital di Indonesia. Kami memilih membuat aplikasi sendiri ketimbang berlangganan tools mahal — lalu kami merilisnya agar orang lain juga bisa pakai.'
                : 'Goden Creative is a small studio building products for creators, marketers, and digital operators across Indonesia. We choose to build our own tools instead of paying for expensive subscriptions — then we ship them so others can use them too.'}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {id
                ? 'godl.ink adalah salah satu produk kami — pemendek tautan modern dengan analitik, QR, dan domain kustom. Inilah produk-produk lain yang kami bangun.'
                : 'godl.ink is one of our products — a modern link shortener with analytics, QR, and custom domains. Here are the other tools we build.'}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {values.map((value) => (
            <StaggerItem key={value.titleEn}>
              <HoverCard>
                <Card className="glass h-full border-white/10 transition hover:border-primary/40 hover:bg-primary/5">
                  <CardContent className="p-6">
                    <value.icon className="h-7 w-7 text-primary" />
                    <h2 className="mt-5 text-xl font-semibold">{id ? value.titleId : value.titleEn}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{id ? value.descId : value.descEn}</p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{id ? 'Produk kami' : 'Our products'}</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {id ? 'Website yang dibangun Goden Creative.' : 'Websites built by Goden Creative.'}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              {id ? 'Setiap produk hidup mandiri, dengan domain dan tim kecil yang memeliharanya.' : 'Each product runs independently, with its own domain and a small team maintaining it.'}
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.08}>
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <HoverCard>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <Card className="glass h-full border-white/10 transition hover:border-primary/40 hover:bg-primary/5">
                    <CardContent className="flex h-full items-start gap-5 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <product.icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold">{product.name}</h3>
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                        </div>
                        <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{product.url.replace('https://', '')}</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{id ? product.descId : product.descEn}</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4}>
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/register">{id ? 'Mulai gratis' : 'Start free'} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/marketing/pricing">{id ? 'Lihat harga' : 'View pricing'}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
