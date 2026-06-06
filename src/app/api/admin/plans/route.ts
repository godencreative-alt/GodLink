import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

function revalidatePlanPages() {
  revalidatePath('/marketing/pricing');
  revalidatePath('/dashboard/settings');
  revalidatePath('/', 'layout');
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: 'asc' }
  });
  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const plan = await prisma.plan.create({
      data: {
        name: body.name,
        price: Number.parseFloat(body.price) || 0,
        currency: body.currency || 'USD',
        interval: body.interval || 'month',
        description: body.description || null,
        icon: body.icon || null,
        maxLinks: Number.parseInt(body.maxLinks) || 50,
        maxClicks: Number.parseInt(body.maxClicks) || 1000,
        maxDomains: Number.parseInt(body.maxDomains) || 0,
        features: body.features || null,
        active: body.active !== false,
        sortOrder: Number.parseInt(body.sortOrder) || 0
      }
    });

    revalidatePlanPages();
    return NextResponse.json(plan, { status: 201 });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Plan name already exists' }, { status: 409 });
    }
    console.error('Plan create error:', e);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}