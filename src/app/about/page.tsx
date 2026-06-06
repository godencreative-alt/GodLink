import type { Metadata } from 'next';
import { AboutClient } from './about-client';

export const metadata: Metadata = {
  title: 'About',
  description: 'Goden Creative builds premium digital tools for creators, marketers, and operators across Indonesia.',
  alternates: { canonical: '/about' }
};

export default function Page() {
  return <AboutClient />;
}
