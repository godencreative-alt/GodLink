'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';
import { translations } from '@/lib/i18n';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: string;
  maxLinks: number;
  maxClicks: number;
  maxDomains: number;
  sortOrder: number;
}

function Value({ value }: { value: string | number | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary" />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-muted-foreground/50" />;
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

function formatPrice(plan: Plan) {
  if (plan.currency === 'USD') return `$${plan.price}`;
  if (plan.currency === 'IDR') return `Rp${Number(plan.price).toLocaleString('id-ID')}`;
  return `${plan.currency} ${plan.price}`;
}

function isStarterPlan(plan: Plan) {
  return plan.price <= 0 || /free|starter/i.test(plan.name);
}

function displayMaxLinks(plan: Plan) {
  return isStarterPlan(plan) ? 3 : plan.maxLinks;
}

export default function PricingClient({ plans }: { plans: Plan[] }) {
  const { locale } = useApp();
  const { status } = useSession();
  const router = useRouter();
  const t = translations[locale];
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);

  const getFeatures = (featuresStr: string) => {
    if (!featuresStr) return [];
    return featuresStr.split(',').map((f) => f.trim()).filter(Boolean);
  };

  const getPlanFeatures = (plan: Plan) => {
    const customFeatures = getFeatures(plan.features);
    const systemFeatures = isStarterPlan(plan)
      ? [
          locale === 'id' ? '3 link aktif' : '3 active links',
          locale === 'id' ? 'Link berlaku 90 hari' : '90-day link validity',
          locale === 'id' ? 'QR Code termasuk' : 'QR Code included',
          locale === 'id' ? 'Tanpa slug kustom' : 'No custom slugs'
        ]
      : [
          locale === 'id' ? 'Slug kustom tersedia' : 'Custom slugs included',
          locale === 'id' ? 'Masa aktif bisa disesuaikan' : 'Custom expiration available'
        ];

    return [...systemFeatures, ...customFeatures];
  };

  const comparisonFeatures = [
    { key: 'maxLinks', label: locale === 'id' ? 'Link aktif' : 'Active links', value: (plan: Plan) => displayMaxLinks(plan) },
    { key: 'customSlugs', label: locale === 'id' ? 'Slug kustom' : 'Custom slugs', value: (plan: Plan) => !isStarterPlan(plan) },
    { key: 'linkValidity', label: locale === 'id' ? 'Masa aktif link' : 'Link validity', value: (plan: Plan) => (isStarterPlan(plan) ? (locale === 'id' ? '90 hari' : '90 days') : (locale === 'id' ? 'Kustom' : 'Custom')) },
    { key: 'maxClicks', label: locale === 'id' ? 'Klik per bulan' : 'Monthly clicks', value: (plan: Plan) => plan.maxClicks },
    { key: 'maxDomains', label: locale === 'id' ? 'Domain kustom' : 'Custom domains', value: (plan: Plan) => plan.maxDomains }
  ];

  async function selectPlan(plan: Plan) {
    setSelectingPlanId(plan.id);
    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id })
    });
    const data = await res.json().catch(() => ({}));
    setSelectingPlanId(null);

    if (!res.ok) {
      toast.error(data.error || (locale === 'id' ? 'Gagal memilih paket' : 'Failed to select plan'));
      return;
    }

    toast.success(locale === 'id' ? `Paket ${plan.name} dipilih` : `${plan.name} plan selected`);
    router.push('/dashboard/settings');
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t.nav.pricing}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="mt-4 text-balance text-5xl font-black tracking-tight md:text-6xl">
              {locale === 'id' ? 'Pilih paket yang tepat untuk setiap alur kerja tautan.' : 'Choose the right plan for every link workflow.'}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {locale === 'id'
                ? 'Perubahan paket dari admin sekarang langsung dibaca dari database dan halaman ini tidak di-cache.'
                : 'Plan changes from admin now load directly from the database and this page is not cached.'}
            </p>
          </FadeIn>
        </div>

        {plans.length === 0 ? (
          <FadeIn delay={0.2} className="mt-14">
            <div className="rounded-3xl border border-white/10 bg-card/60 p-10 text-center text-muted-foreground">
              {locale === 'id' ? 'Belum ada paket aktif. Tambahkan paket dari Admin > Plans.' : 'No active plans yet. Add plans from Admin > Plans.'}
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="mt-14 grid gap-6 lg:grid-cols-3" staggerDelay={0.15}>
            {plans.map((plan, idx) => {
              const features = getFeatures(plan.features);
              const isPopular = idx === 1 || plans.length === 1;
              const isAuthenticated = status === 'authenticated';
              const isSelecting = selectingPlanId === plan.id;
              return (
                <StaggerItem key={plan.id}>
                  <HoverCard>
                    <div className={isPopular ? 'relative rounded-3xl border border-primary/50 bg-primary/[0.06] p-8 shadow-2xl shadow-primary/10' : 'glass rounded-3xl p-8'}>
                      {isPopular && (
                        <div className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          {locale === 'id' ? 'Paling populer' : 'Most popular'}
                        </div>
                      )}
                      <h2 className="text-2xl font-bold">{plan.name}</h2>
                      <p className="mt-4 text-5xl font-black">
                        {formatPrice(plan)}
                        <span className="text-base font-medium text-muted-foreground">/{plan.interval}</span>
                      </p>
                      <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                      <ul className="mt-8 space-y-3 text-sm">
                        {features.length > 0 ? features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-primary" /> {feature}
                          </li>
                        )) : (
                          <li className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-primary" /> {locale === 'id' ? 'Fitur paket mengikuti pengaturan admin' : 'Plan features follow admin settings'}
                          </li>
                        )}
                      </ul>

                      {isAuthenticated ? (
                        <Button
                          type="button"
                          className="mt-8 w-full"
                          variant={isPopular ? 'default' : 'outline'}
                          disabled={isSelecting}
                          onClick={() => selectPlan(plan)}
                        >
                          {isSelecting ? (locale === 'id' ? 'Memilih...' : 'Selecting...') : (locale === 'id' ? `Pilih ${plan.name}` : `Choose ${plan.name}`)}
                        </Button>
                      ) : (
                        <Button asChild className="mt-8 w-full" variant={isPopular ? 'default' : 'outline'}>
                          <Link href={`/auth/register?plan=${plan.id}`}>{locale === 'id' ? 'Daftar & pilih paket' : 'Register & choose plan'}</Link>
                        </Button>
                      )}
                    </div>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {plans.length > 0 && (
          <FadeIn delay={0.5} className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{locale === 'id' ? 'Bandingkan paket' : 'Compare plans'}</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                {plans.map((p) => p.name).join(' vs ')}
              </h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-2xl backdrop-blur-xl">
              <div className="grid border-b border-white/10 bg-white/[0.03] text-sm font-semibold" style={{ gridTemplateColumns: `1fr repeat(${plans.length}, 1fr)` }}>
                <div className="p-5 text-left">{locale === 'id' ? 'Fitur' : 'Feature'}</div>
                {plans.map((plan) => (
                  <div key={plan.id} className="p-5 text-center">{plan.name}</div>
                ))}
              </div>
              {comparisonFeatures.map((row, index) => (
                <div key={row.key} className={`grid items-center border-b border-white/10 last:border-b-0 ${index % 2 === 0 ? 'bg-white/[0.015]' : ''}`} style={{ gridTemplateColumns: `1fr repeat(${plans.length}, 1fr)` }}>
                  <div className="p-5 text-sm font-medium">{row.label}</div>
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-5 text-center">
                      <Value value={(plan as any)[row.key]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.6} className="mt-20">
          <div className="rounded-3xl border border-primary/20 bg-primary/10 p-8 text-center">
            <h2 className="text-3xl font-bold">{locale === 'id' ? 'Butuh setup khusus?' : 'Need a custom setup?'}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              {locale === 'id'
                ? 'Untuk redirect volume tinggi, SLA kustom, atau integrasi ekosistem Goden, hubungi Goden Creative untuk paket yang disesuaikan.'
                : 'For high-volume redirects, custom SLA, or Goden ecosystem integrations, contact Goden Creative for a tailored plan.'}
            </p>
            <Button asChild className="mt-6">
              <Link href="mailto:hello@godencreative.com">{locale === 'id' ? 'Hubungi pemilik' : 'Contact owner'}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
