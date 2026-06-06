'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Globe2,
  KeyRound,
  Lock,
  MousePointerClick,
  QrCode,
  ShieldCheck,
  Sparkles,
  Timer,
  UserCog,
  Ban,
  Zap,
  Languages,
  Palette,
  Mail,
  Server,
  Users,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

const parity = {
  en: [
    { icon: KeyRound, title: 'Custom slugs', body: 'Members can pick their own slug for branded campaign URLs.' },
    { icon: BarChart3, title: 'Click analytics', body: 'Country, device, browser, OS, referrer, and timeline charts.' },
    { icon: Globe2, title: 'Custom domains', body: 'Connect your own domain with DNS verification.' },
    { icon: QrCode, title: 'QR per link', body: 'Every link ships with a downloadable QR code.' },
    { icon: Lock, title: 'Password protected', body: 'Lock any link behind a password before redirect.' },
    { icon: Timer, title: 'Expiring links', body: 'Set an expiration date or auto-expire by plan.' },
    { icon: Hash, title: 'Public API', body: 'Bearer-token API for programmatic link creation.' },
    { icon: UserCog, title: 'Admin CMS', body: 'Plan, user, ticket, and settings management.' },
    { icon: Ban, title: 'Banned governance', body: 'Ban abusive links and surface them in the admin view.' }
  ],
  id: [
    { icon: KeyRound, title: 'Slug kustom', body: 'Member dapat memilih slug sendiri untuk URL kampanye bermerek.' },
    { icon: BarChart3, title: 'Analitik klik', body: 'Negara, perangkat, browser, OS, referrer, dan grafik timeline.' },
    { icon: Globe2, title: 'Domain kustom', body: 'Hubungkan domain Anda sendiri dengan verifikasi DNS.' },
    { icon: QrCode, title: 'QR per tautan', body: 'Setiap tautan dilengkapi kode QR yang bisa diunduh.' },
    { icon: Lock, title: 'Proteksi password', body: 'Kunci tautan dengan kata sandi sebelum diarahkan.' },
    { icon: Timer, title: 'Tautan kedaluwarsa', body: 'Atur tanggal kedaluwarsa atau biarkan paket yang menentukan.' },
    { icon: Hash, title: 'API publik', body: 'API Bearer-token untuk membuat tautan secara otomatis.' },
    { icon: UserCog, title: 'CMS admin', body: 'Manajemen paket, pengguna, tiket, dan pengaturan.' },
    { icon: Ban, title: 'Tata kelola banned', body: 'Blokir tautan yang menyalahgunakan dan tampilkan di admin.' }
  ]
};

const polish = {
  en: [
    { icon: Sparkles, title: '4-character auto slugs', body: 'Cleaner short codes than Kutt defaults — `godl.ink/5c44`.' },
    { icon: Users, title: 'Guest links + QR', body: 'No signup required to create a link with QR. 30-day TTL.' },
    { icon: Zap, title: 'Free plan auto-cap', body: '3 links / 90-day TTL by default — clear, predictable boundaries.' },
    { icon: Languages, title: 'Bilingual UI', body: 'Full English and Indonesian translations across the app.' },
    { icon: Palette, title: 'Themed accents', body: 'Light and dark themes with an amber Goden accent.' },
    { icon: MousePointerClick, title: 'Motion polish', body: 'Framer Motion page transitions on every screen.' },
    { icon: Mail, title: 'Email verification', body: 'Built-in Resend integration for verified onboarding.' },
    { icon: Server, title: 'aaPanel-friendly', body: 'Deployment guide and configs ready for aaPanel hosting.' }
  ],
  id: [
    { icon: Sparkles, title: 'Slug otomatis 4 karakter', body: 'Kode lebih bersih dari default Kutt — `godl.ink/5c44`.' },
    { icon: Users, title: 'Link tamu + QR', body: 'Tanpa daftar untuk buat tautan dengan QR. Aktif 30 hari.' },
    { icon: Zap, title: 'Auto-batas paket gratis', body: '3 tautan / kedaluwarsa 90 hari — batas jelas dan dapat diprediksi.' },
    { icon: Languages, title: 'UI dwibahasa', body: 'Terjemahan English dan Indonesia lengkap di seluruh aplikasi.' },
    { icon: Palette, title: 'Aksen bertema', body: 'Tema terang dan gelap dengan aksen amber Goden.' },
    { icon: MousePointerClick, title: 'Poles animasi', body: 'Transisi halaman Framer Motion di setiap layar.' },
    { icon: Mail, title: 'Verifikasi email', body: 'Integrasi Resend bawaan untuk onboarding terverifikasi.' },
    { icon: Server, title: 'Ramah aaPanel', body: 'Panduan deploy dan konfigurasi siap untuk hosting aaPanel.' }
  ]
};

const features = {
  en: [
    { icon: Zap, title: 'Fast short links', body: 'Create branded links with custom slugs, descriptions, expiration, and protection.' },
    { icon: BarChart3, title: 'Analytics built in', body: 'Track clicks by day, country, device, browser, referrer, and destination.' },
    { icon: Globe2, title: 'Custom domains', body: 'Use godl.ink by default or connect verified domains for campaigns.' },
    { icon: KeyRound, title: 'Developer API', body: 'API keys are ready for automation, app integrations, and product workflows.' },
    { icon: QrCode, title: 'QR ready', body: 'Generate QR codes for every link and reuse them across print and events.' },
    { icon: ShieldCheck, title: 'Owner controls', body: 'Admin view, banned links, account visibility, and safer link management.' }
  ],
  id: [
    { icon: Zap, title: 'Tautan pendek cepat', body: 'Buat tautan bermerek dengan slug kustom, deskripsi, kedaluwarsa, dan proteksi.' },
    { icon: BarChart3, title: 'Analitik bawaan', body: 'Lacak klik per hari, negara, perangkat, browser, referrer, dan tujuan.' },
    { icon: Globe2, title: 'Domain kustom', body: 'Gunakan godl.ink secara default atau hubungkan domain terverifikasi untuk kampanye.' },
    { icon: KeyRound, title: 'API Developer', body: 'Kunci API siap untuk otomasi, integrasi aplikasi, dan alur kerja produk.' },
    { icon: QrCode, title: 'Siap QR', body: 'Buat kode QR untuk setiap tautan dan gunakan kembali di media cetak dan acara.' },
    { icon: ShieldCheck, title: 'Kontrol pemilik', body: 'Tampilan admin, tautan diblokir, visibilitas akun, dan manajemen tautan yang lebih aman.' }
  ]
};

export function HomeClient() {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center sm:pt-20 sm:pb-12 lg:pt-28">
        <FadeIn>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            {id ? 'Setara Kutt, dipoles Goden Creative' : 'Kutt parity, Goden Creative polish'}
          </div>
          <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            {id ? 'Dibangun di atas Kutt, dipoles oleh Goden Creative.' : 'Built on Kutt, polished by Goden Creative.'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {id
              ? 'Setiap fitur Kutt yang Anda andalkan — ditambah lapisan keramahan, kecepatan, dan estetika khas Goden.'
              : 'Every Kutt feature you rely on — plus a layer of warmth, speed, and aesthetic that only Goden ships.'}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/register">{id ? 'Mulai gratis' : 'Start free'} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/marketing/pricing">{id ? 'Lihat harga' : 'View pricing'}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{id ? 'Setara Kutt' : 'Kutt parity'}</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {id ? 'Setiap fitur Kutt yang serius. Tanpa kompromi.' : 'Every serious Kutt feature. No compromise.'}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              {id ? 'godl.ink mereplikasi semua hal yang membuat Kutt dapat diandalkan untuk produksi.' : 'godl.ink replicates everything that made Kutt production-grade.'}
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {parity[locale].map((item) => (
            <StaggerItem key={item.title}>
              <HoverCard>
                <div className="glass h-full rounded-3xl p-6 transition hover:border-primary/40 hover:bg-white/[0.05]">
                  <item.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{id ? 'Poles Goden' : 'Goden polish'}</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {id ? 'Yang Goden tambahkan di atasnya.' : 'What Goden adds on top.'}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              {id ? 'Detail kecil yang membuat platform terasa premium, bukan generik.' : 'The small details that make the platform feel premium, not generic.'}
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
          {polish[locale].map((item) => (
            <StaggerItem key={item.title}>
              <HoverCard>
                <div className="glass h-full rounded-3xl border border-primary/20 bg-primary/5 p-6 transition hover:border-primary/50 hover:bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{id ? 'Selebihnya' : 'Everything else'}</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">{id ? 'Ringkasan singkat untuk yang terburu-buru.' : 'A quick summary for the impatient.'}</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {features[locale].map((feature) => (
            <StaggerItem key={feature.title}>
              <HoverCard>
                <div className="glass rounded-3xl p-6 transition hover:border-primary/40 hover:bg-white/[0.05]">
                  <feature.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </main>
  );
}
