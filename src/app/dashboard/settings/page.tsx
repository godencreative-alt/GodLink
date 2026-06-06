import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SettingsPageClient } from '@/components/dashboard/settings-page-client';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const [user, plans] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, apiKey: true, role: true, planId: true, locale: true, createdAt: true, plan: true }
    }),
    prisma.plan.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  ]);

  return <SettingsPageClient user={user} plans={plans} />;
}