import type { Metadata } from 'next';
import { HomeClient } from './features-client';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Kutt parity with Goden polish: 4-character slugs, guest QR codes, click analytics, custom domains, and more.',
  alternates: { canonical: '/features' }
};

export default function Page() {
  return <HomeClient />;
}
