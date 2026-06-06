import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { LinkTableWrapper } from '@/components/dashboard/link-table-wrapper';
import { FadeIn } from '@/components/ui/animations';

export default async function LinksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      slug: true,
      target: true,
      description: true,
      expiresAt: true,
      banned: true,
      createdAt: true,
      _count: { select: { clicks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <LinkTableWrapper links={links} />
    </div>
  );
}
