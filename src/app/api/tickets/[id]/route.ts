import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const updateTicketSchema = z.object({
  reply: z.string().max(4000).optional().or(z.literal('')),
  status: z.enum(['OPEN', 'REPLIED', 'CLOSED']).optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const parsed = updateTicketSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const existing = await prisma.ticket.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        reply: parsed.data.reply,
        status: parsed.data.status || 'REPLIED'
      }
    });
    return NextResponse.json(ticket);
  } catch (e) {
    console.error('Ticket update error:', e);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}