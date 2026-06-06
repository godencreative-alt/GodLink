import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminOverviewClient } from '@/components/admin/admin-overview-client';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard/links');

  const [users, links, clicks, tickets] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.click.count(),
    prisma.ticket.count({ where: { status: 'OPEN' } })
  ]);

  return <AdminOverviewClient users={users} links={links} clicks={clicks} tickets={tickets} />;
}