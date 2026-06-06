import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [users, links, clicks] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.click.count()
  ]);

  return NextResponse.json({ users, links, clicks });
}