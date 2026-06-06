import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/topbar';
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar';
import { AdsBanner } from '@/components/ads/ads-banner';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar user={session.user} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <TopBar user={session.user} mobileSidebar={<MobileSidebar user={session.user} />} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        <AdsBanner slot="sidebar" className="px-4 pb-4 sm:px-6" />
      </div>
    </div>
  );
}