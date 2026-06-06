import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AnalyticsPageClient } from '@/components/dashboard/analytics-page-client';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const totalLinks = await prisma.link.count({ where: { userId: session.user.id } });
  const totalClicks = await prisma.click.count({ where: { link: { userId: session.user.id } } });

  const recentClicks = await prisma.click.findMany({
    where: { link: { userId: session.user.id } },
    orderBy: { createdAt: 'desc' },
    take: 500,
    include: { link: { select: { slug: true } } }
  });

  const byCountry: Record<string, number> = {};
  const byDevice: Record<string, number> = {};
  const byBrowser: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  recentClicks.forEach((click) => {
    const country = click.country || 'Unknown';
    byCountry[country] = (byCountry[country] || 0) + 1;
    const device = click.device || 'desktop';
    byDevice[device] = (byDevice[device] || 0) + 1;
    const browser = click.browser || 'Unknown';
    byBrowser[browser] = (byBrowser[browser] || 0) + 1;
    const day = click.createdAt.toISOString().split('T')[0];
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return <AnalyticsPageClient totalLinks={totalLinks} totalClicks={totalClicks} byCountry={byCountry} byDevice={byDevice} byBrowser={byBrowser} byDay={byDay} />;
}