import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DomainsPageClient } from '@/components/dashboard/domains-page-client';

export default async function DomainsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const domains = await prisma.domain.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return <DomainsPageClient domains={domains} />;
}