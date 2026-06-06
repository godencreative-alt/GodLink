import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How godl.ink and Goden Creative collect, store, and protect your data.',
  alternates: { canonical: '/privacy' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
