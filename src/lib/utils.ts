import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getShortUrl(slug: string, domain?: string | null): string {
  const base = domain || process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'godl.ink';
  if (process.env.NODE_ENV !== 'production') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
    return appUrl + '/' + slug;
  }
  return 'https://' + base + '/' + slug;
}
