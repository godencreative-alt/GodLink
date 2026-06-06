import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to godl.ink to manage your short links, analytics, and custom domains.',
  alternates: { canonical: '/auth/login' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
