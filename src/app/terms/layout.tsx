import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for godl.ink — usage rules, acceptable use, and account responsibilities.',
  alternates: { canonical: '/terms' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
