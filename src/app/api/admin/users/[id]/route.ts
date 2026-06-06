import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

async function isLastAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') return false;
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  return adminCount <= 1;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const data: any = {};

    if (body.name !== undefined) data.name = String(body.name).trim() || null;
    if (body.email !== undefined) data.email = String(body.email).trim().toLowerCase();

    if (body.role !== undefined) {
      if (!['USER', 'ADMIN'].includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      if (body.role !== 'ADMIN' && await isLastAdmin(id)) {
        return NextResponse.json({ error: 'Cannot remove the last admin' }, { status: 400 });
      }
      data.role = body.role;
    }

    if (body.planId !== undefined) {
      if (!body.planId) {
        data.planId = null;
      } else {
        const plan = await prisma.plan.findUnique({ where: { id: body.planId }, select: { id: true } });
        if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
        data.planId = plan.id;
      }
    }

    if (body.password) {
      if (String(body.password).length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      data.password = await hash(body.password, 12);
    }

    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error('User update error:', e);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }
    if (await isLastAdmin(id)) {
      return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('User delete error:', e);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}