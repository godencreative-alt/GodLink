import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminTicketsClient } from '@/components/admin/admin-tickets-client';

export default async function AdminTicketsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard/links');

  const tickets = await prisma.ticket.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return <AdminTicketsClient tickets={tickets} />;
}