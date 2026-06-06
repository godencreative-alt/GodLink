import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  redirect(session.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/links');
}
