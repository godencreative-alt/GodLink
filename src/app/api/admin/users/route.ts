import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      planId: true,
      locale: true,
      createdAt: true,
      plan: { select: { name: true } },
      _count: { select: { links: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(users);
}