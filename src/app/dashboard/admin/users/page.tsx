import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminUsersClient } from '@/components/admin/admin-users-client';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard/links');

  const [users, plans] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, planId: true, createdAt: true, plan: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } })
  ]);

  return <AdminUsersClient users={users} plans={plans} />;
}