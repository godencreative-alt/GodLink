import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Submit a support ticket or share feedback with the godl.ink team.',
  alternates: { canonical: '/support' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
