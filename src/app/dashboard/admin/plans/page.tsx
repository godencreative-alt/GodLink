import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminPlansClient } from '@/components/admin/admin-plans-client';

export default async function AdminPlansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard/links');

  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
  return <AdminPlansClient plans={plans} />;
}