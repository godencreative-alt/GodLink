import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

function revalidatePlanPages() {
  revalidatePath('/marketing/pricing');
  revalidatePath('/dashboard/settings');
  revalidatePath('/', 'layout');
}

function safeNumber(value: unknown, fallback?: number): number | undefined {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: body.name,
        price: safeNumber(body.price),
        currency: body.currency,
        interval: body.interval,
        description: body.description,
        icon: body.icon,
        maxLinks: safeNumber(body.maxLinks),
        maxClicks: safeNumber(body.maxClicks),
        maxDomains: safeNumber(body.maxDomains),
        features: body.features,
        active: body.active,
        sortOrder: safeNumber(body.sortOrder)
      }
    });

    revalidatePlanPages();
    return NextResponse.json(plan);
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Plan name already exists' }, { status: 409 });
    }
    console.error('Plan update error:', e);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.plan.delete({ where: { id } });
    revalidatePlanPages();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Plan delete error:', e);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}