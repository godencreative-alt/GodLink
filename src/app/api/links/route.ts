import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLinkSchema } from '@/lib/validators/schemas';
import { createSlug, isReservedSlug } from '@/lib/slug';
import { getShortUrl } from '@/lib/utils';
import { hash } from 'bcryptjs';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getApiUser } from '@/lib/api-auth';

const GUEST_LINK_LIMIT_PER_IP = 2;
const GUEST_LINK_TTL_DAYS = 30;
const FREE_MEMBER_LINK_TTL_DAYS = 90;
const FREE_MEMBER_LINK_LIMIT = 3;

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function isActiveLinkWhere(userId: string) {
  return {
    userId,
    banned: false,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
  };
}

function activeGuestLinksFromIpWhere(ip: string) {
  return {
    userId: null,
    creatorIp: ip,
    banned: false,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
  };
}

function isFreePlan(plan?: { price: number; name?: string | null } | null) {
  if (!plan) return true;
  return plan.price <= 0 || ['free', 'starter'].some((keyword) => plan.name?.toLowerCase().includes(keyword));
}

async function getAvailableSlug(customSlug?: string | null) {
  if (customSlug && customSlug.length > 0) {
    const slug = createSlug(customSlug);
    if (!slug) throw new Error('Invalid slug');
    if (isReservedSlug(slug)) throw new Error('This slug is reserved');
    const exists = await prisma.link.findUnique({ where: { slug } });
    if (exists) throw new Error('Slug already taken');
    return slug;
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    const slug = createSlug();
    const exists = await prisma.link.findUnique({ where: { slug } });
    if (!exists && !isReservedSlug(slug)) return slug;
  }

  throw new Error('Could not generate a unique slug');
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const user = await getApiUser(request);

    const limit = rateLimit(user?.id || ip, {
      windowMs: 60000,
      max: user?.id ? 30 : 5
    });

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.resetAt.toString()
          }
        }
      );
    }

    const body = await request.json();
    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { target, slug: customSlug, description, password, expiresAt, domainId } = parsed.data;
    const customSlugRequested = Boolean(customSlug && customSlug.trim().length > 0);

    let dbUser: null | { plan: null | { name: string; price: number; maxLinks: number } } = null;
    const isAdmin = user?.role === 'ADMIN';

    if (user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { plan: { select: { name: true, price: true, maxLinks: true } } }
      });
    }

    const freeMember = Boolean(user?.id && !isAdmin && isFreePlan(dbUser?.plan));

    if (!user?.id && customSlugRequested) {
      return NextResponse.json(
        { error: 'Custom links are available for members only. Guest links use automatic 4-character codes.', upgradeUrl: '/auth/register' },
        { status: 403 }
      );
    }

    if (freeMember && customSlugRequested) {
      return NextResponse.json(
        { error: 'Free plan cannot use custom links. Upgrade to Pro to customize your slug.', upgradeUrl: '/marketing/pricing' },
        { status: 403 }
      );
    }

    const slug = await getAvailableSlug(customSlugRequested ? customSlug : null).catch((error: Error) => {
      throw Object.assign(error, { statusCode: error.message === 'Slug already taken' ? 409 : 400 });
    });

    let guestLinksFromIp = 0;
    if (!user?.id) {
      guestLinksFromIp = await prisma.link.count({
        where: activeGuestLinksFromIpWhere(ip)
      });

      if (guestLinksFromIp >= GUEST_LINK_LIMIT_PER_IP) {
        return NextResponse.json(
          {
            error: 'Guest limit reached for this IP. Please create a free account to generate more links.',
            limit: GUEST_LINK_LIMIT_PER_IP,
            upgradeUrl: '/auth/register'
          },
          { status: 403 }
        );
      }
    }

    let domainHost: string | null = null;
    if (domainId) {
      if (!user?.id) {
        return NextResponse.json({ error: 'Login is required to use a custom domain' }, { status: 401 });
      }

      const domain = await prisma.domain.findUnique({ where: { id: domainId } });
      if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
      if (domain.userId !== user.id && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden domain' }, { status: 403 });
      }
      domainHost = domain.hostname;
    }

    if (user?.id && !isAdmin) {
      const maxLinks = freeMember ? FREE_MEMBER_LINK_LIMIT : dbUser?.plan?.maxLinks ?? FREE_MEMBER_LINK_LIMIT;
      const usedLinks = await prisma.link.count({ where: isActiveLinkWhere(user.id) });

      if (usedLinks >= maxLinks) {
        return NextResponse.json(
          {
            error: freeMember
              ? 'Free plan is limited to 3 active links. Upgrade to Pro for more links.'
              : 'Plan link limit reached. Please upgrade your plan.',
            limit: maxLinks,
            upgradeUrl: '/marketing/pricing'
          },
          { status: 403 }
        );
      }
    }

    const forcedExpiresAt = !user?.id
      ? addDays(GUEST_LINK_TTL_DAYS)
      : freeMember
        ? addDays(FREE_MEMBER_LINK_TTL_DAYS)
        : expiresAt
          ? new Date(expiresAt)
          : null;

    const link = await prisma.link.create({
      data: {
        slug,
        target,
        description: description || null,
        password: password ? await hash(password, 12) : null,
        expiresAt: forcedExpiresAt,
        userId: user?.id || null,
        domainId: domainId || null,
        creatorIp: ip
      }
    });

    const shortUrl = getShortUrl(link.slug, domainHost);
    const qrUrl = `/api/qr?slug=${encodeURIComponent(link.slug)}`;
    const expiresInDays = !user?.id ? GUEST_LINK_TTL_DAYS : freeMember ? FREE_MEMBER_LINK_TTL_DAYS : null;

    return NextResponse.json(
      {
        id: link.id,
        slug: link.slug,
        shortUrl,
        qrUrl,
        expiresAt: link.expiresAt,
        expiresInDays,
        guestRemaining: user?.id ? null : Math.max(GUEST_LINK_LIMIT_PER_IP - guestLinksFromIp - 1, 0),
        upgradeUrl: !user?.id ? '/auth/register' : freeMember ? '/marketing/pricing' : null,
        upgradeMessage: !user?.id
          ? 'Create a free account to keep links for 90 days.'
          : freeMember
            ? 'Upgrade to Pro for custom slugs and more links.'
            : null
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': limit.remaining.toString()
        }
      }
    );
  } catch (error: any) {
    if (error?.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Create link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      include: { _count: { select: { clicks: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
