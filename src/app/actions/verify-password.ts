'use server';

import { cookies } from 'next/headers';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function verifyLinkPassword(
  slug: string,
  password: string
): Promise<{ success: true } | { success: false }> {
  try {
    const link = await prisma.link.findUnique({
      where: { slug },
      select: { password: true, banned: true, expiresAt: true }
    });

    if (!link || link.banned || !link.password) return { success: false };
    if (link.expiresAt && link.expiresAt < new Date()) return { success: false };

    const valid = await compare(password, link.password);
    if (!valid) return { success: false };

    // Set a short-lived httpOnly cookie scoped to this slug's path so the
    // server component can verify on the next request without a password in
    // the URL (no history leak, no Referer leak).
    const cookieStore = await cookies();
    cookieStore.set(`link_auth_${slug}`, '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: `/${slug}`,
      maxAge: 3600 // 1 hour
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}
