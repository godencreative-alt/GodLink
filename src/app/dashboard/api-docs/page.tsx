import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ApiDocsPageClient } from '@/components/dashboard/api-docs-page-client';

export default async function ApiDocsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true }
  });

  return <ApiDocsPageClient apiKey={user?.apiKey || null} />;
}