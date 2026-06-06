import { auth } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-settings';
import { redirect } from 'next/navigation';
import { AdminSettingsClient } from '@/components/admin/admin-settings-client';

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard/links');

  const settings = await getSiteSettings();
  return <AdminSettingsClient settings={settings} />;
}