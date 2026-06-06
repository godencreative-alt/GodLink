import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { getShortUrl } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 });

  const link = await prisma.link.findUnique({
    where: { slug },
    include: { domain: { select: { hostname: true } } }
  });
  if (!link || link.banned) return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Link expired' }, { status: 410 });
  }

  const url = getShortUrl(slug, link.domain?.hostname || null);
  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    color: { dark: '#F5B544', light: '#0B0D17' }
  });

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}