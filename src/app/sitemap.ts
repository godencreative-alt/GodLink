import type { MetadataRoute } from 'next';

const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/marketing/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/support', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/auth/login', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/auth/register', priority: 0.6, changeFrequency: 'yearly' }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const lastModified = new Date();
  return PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified,
    priority,
    changeFrequency
  }));
}
