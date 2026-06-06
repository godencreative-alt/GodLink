import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getApiUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const link = await prisma.link.findUnique({ where: { id } });

    if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (link.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const totalClicks = await prisma.click.count({ where: { linkId: id } });

    const countryGroups = await prisma.click.groupBy({
      by: ['country'],
      where: { linkId: id },
      _count: { _all: true }
    });
    const byCountry: Record<string, number> = {};
    countryGroups.forEach((g) => { byCountry[g.country || 'Unknown'] = g._count._all; });

    const deviceGroups = await prisma.click.groupBy({
      by: ['device'],
      where: { linkId: id },
      _count: { _all: true }
    });
    const byDevice: Record<string, number> = {};
    deviceGroups.forEach((g) => { byDevice[g.device || 'desktop'] = g._count._all; });

    const browserGroups = await prisma.click.groupBy({
      by: ['browser'],
      where: { linkId: id },
      _count: { _all: true }
    });
    const byBrowser: Record<string, number> = {};
    browserGroups.forEach((g) => { byBrowser[g.browser || 'Unknown'] = g._count._all; });

    const recentClicks = await prisma.click.findMany({
      where: { linkId: id, createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    const byDay: Record<string, number> = {};
    recentClicks.forEach((click) => {
      const day = click.createdAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });

    return NextResponse.json({ totalClicks, byCountry, byDevice, byBrowser, byDay });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}