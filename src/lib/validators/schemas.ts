import { z } from 'zod';

const safeUrl = z
  .string()
  .url('Enter a valid destination URL')
  .refine(
    (value) => {
      try {
        const u = new URL(value);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Only http(s) URLs are allowed' }
  );

export const createLinkSchema = z.object({
  target: safeUrl,
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(64, 'Slug must be less than 64 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, dashes, and underscores')
    .optional()
    .or(z.literal('')),
  description: z.string().max(160).optional().or(z.literal('')),
  password: z.string().min(4).max(128).optional().or(z.literal('')),
  expiresAt: z
    .string()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Enter a valid expiration date')
    .optional()
    .or(z.literal('')),
  domainId: z.string().optional().or(z.literal(''))
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  planId: z.string().optional().or(z.literal(''))
});
