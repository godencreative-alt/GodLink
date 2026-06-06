import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  hostname: z.string().min(3).max(253).regex(/^[a-z0-9.-]+$/i)
});

function normalizeHostname(value: unknown) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '');
}

async function getUserDomainLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: { select: { maxDomains: true } } }
  });

  if (user?.plan) return user.plan.maxDomains;

  const starterPlan = await prisma.plan.findFirst({
    where: { active: true },
    orderBy: [{ price: 'asc' }, { sortOrder: 'asc' }],
    select: { maxDomains: true }
  });

  return starterPlan?.maxDomains ?? 0;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const hostname = normalizeHostname(body.hostname);
    const parsed = schema.safeParse({ hostname });
    if (!parsed.success) return NextResponse.json({ error: 'Invalid hostname' }, { status: 400 });

    if (session.user.role !== 'ADMIN') {
      const maxDomains = await getUserDomainLimit(session.user.id);
      const usedDomains = await prisma.domain.count({ where: { userId: session.user.id } });
      if (usedDomains >= maxDomains) {
        return NextResponse.json({ error: 'Plan domain limit reached. Please upgrade your plan.' }, { status: 403 });
      }
    }

    const domain = await prisma.domain.create({
      data: { hostname: parsed.data.hostname, userId: session.user.id }
    });

    return NextResponse.json(domain, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Domain already exists' }, { status: 409 });
    console.error('Domain error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const domains = await prisma.domain.findMany({ where: { userId: session.user.id } });
  return NextResponse.json(domains);
}