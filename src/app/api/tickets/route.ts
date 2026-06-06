import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ticketSchema = z.object({
  email: z.string().email().optional(),
  type: z.enum(['support', 'feedback', 'complaint']).optional(),
  subject: z.string().min(3).max(150),
  message: z.string().min(5).max(4000)
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = session.user.role === 'ADMIN';

  const tickets = await prisma.ticket.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const parsed = ticketSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    if (!session?.user?.id && !parsed.data.email) {
      return NextResponse.json({ error: 'Email is required for public support tickets' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        type: parsed.data.type || 'support',
        subject: parsed.data.subject,
        message: parsed.data.message,
        email: parsed.data.email || session?.user?.email || null,
        userId: session?.user?.id || null
      }
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (e) {
    console.error('Ticket create error:', e);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}