import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import PricingClient from './pricing-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free, Pro, and Team plans for godl.ink. Custom slugs, analytics, custom domains, and API access.',
  alternates: { canonical: '/marketing/pricing' }
};

export default async function PricingPage() {
  noStore();

  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { price: 'asc' }]
  });

  const serialized = plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    currency: p.currency || 'USD',
    interval: p.interval || 'month',
    description: p.description || '',
    features: p.features || '',
    maxLinks: p.maxLinks,
    maxClicks: p.maxClicks,
    maxDomains: p.maxDomains,
    sortOrder: p.sortOrder
  }));

  return <PricingClient plans={serialized} />;
}