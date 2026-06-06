'use client';

import { FadeIn } from '@/components/ui/animations';
import { UserSettingsPanel } from '@/components/dashboard/user-settings-panel';
import { useApp } from '@/components/providers/app-provider';

export function SettingsPageClient({ user, plans }: { user: any; plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Pengaturan akun' : 'Account settings'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Kelola profil, password, API key, paket, dan tiket dukungan Anda.' : 'Manage your profile, password, API key, plan, and support tickets.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <UserSettingsPanel user={user} plans={plans} />
      </FadeIn>
    </div>
  );
}