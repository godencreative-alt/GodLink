import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getApiUser } from '@/lib/api-auth';

const updateLinkSchema = z.object({
  target: z.string().url('Enter a valid destination URL').optional(),
  description: z.string().max(160).optional().nullable(),
  expiresAt: z
    .string()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Enter a valid expiration date')
    .optional()
    .nullable()
    .or(z.literal('')),
  banned: z.boolean().optional()
});

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const parsed = updateLinkSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const data: any = {};
    if (parsed.data.target !== undefined) data.target = parsed.data.target;
    if (parsed.data.description !== undefined) data.description = parsed.data.description || null;
    if (parsed.data.expiresAt !== undefined) data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
    if (parsed.data.banned !== undefined) {
      if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Only admins can ban links' }, { status: 403 });
      data.banned = parsed.data.banned;
    }

    const updated = await prisma.link.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}