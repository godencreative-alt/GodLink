'use client';

import { FadeIn } from '@/components/ui/animations';
import { UsersAdmin } from '@/components/admin/users-admin';
import { useApp } from '@/components/providers/app-provider';

export function AdminUsersClient({ users, plans }: { users: any[]; plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Pengguna' : 'Users'}</h1>
          <p className="mt-2 text-muted-foreground">{id ? 'Admin dapat mengubah nama, email, password, role, dan paket pengguna.' : 'Admins can change usernames, emails, passwords, roles, and plans.'}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <UsersAdmin users={users} plans={plans} />
      </FadeIn>
    </div>
  );
}