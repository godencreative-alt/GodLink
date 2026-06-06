import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your free godl.ink account — keep your short links for 90 days, custom slugs available on Pro.',
  alternates: { canonical: '/auth/register' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
