import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/admin-auth';

export async function GET() {
  const { error, session } = await requireUser();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      apiKey: true,
      planId: true,
      locale: true,
      createdAt: true,
      plan: true
    }
  });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const { error, session } = await requireUser();
  if (error) return error;

  try {
    const body = await request.json();
    const data: any = {};

    if (body.name !== undefined) data.name = String(body.name).trim() || null;
    if (body.locale !== undefined) {
      if (!['en', 'id'].includes(body.locale)) {
        return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
      }
      data.locale = body.locale;
    }

    if (body.newPassword) {
      const me = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (me?.password) {
        const ok = await compare(body.currentPassword || '', me.password);
        if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      if (body.newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      data.password = await hash(body.newPassword, 12);
    }

    if (body.rotateApiKey) {
      data.apiKey = randomBytes(24).toString('hex');
    }

    if (body.planId !== undefined && session.user.role === 'ADMIN') {
      if (!body.planId) {
        data.planId = null;
      } else {
        const plan = await prisma.plan.findFirst({
          where: { id: body.planId, active: true },
          select: { id: true }
        });
        if (!plan) return NextResponse.json({ error: 'Selected plan is not available' }, { status: 400 });
        data.planId = plan.id;
      }
    }

    const user = await prisma.user.update({ where: { id: session.user.id }, data });
    return NextResponse.json({ id: user.id, apiKey: user.apiKey, planId: user.planId });
  } catch (e) {
    console.error('User update error:', e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}