import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 4);

export function createSlug(customSlug?: string | null) {
  if (customSlug) {
    return customSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  return nanoid();
}

export function isReservedSlug(slug: string) {
  return [
    'api',
    'auth',
    'dashboard',
    'home',
    'about',
    'privacy',
    'terms',
    'support',
    'marketing',
    'pricing',
    'settings',
    'admin',
    'login',
    'register',
    'api-docs'
  ].includes(slug.toLowerCase());
}