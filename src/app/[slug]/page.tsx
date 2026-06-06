import { notFound, redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import { prisma } from '@/lib/prisma';
import { PasswordPrompt } from '@/components/redirect/password-prompt';
import { LinkExpired } from '@/components/redirect/link-expired';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function trackClick(linkId: string, headersList: Headers) {
  try {
    const ua = headersList.get('user-agent') || '';
    const parser = new UAParser(ua);
    const result = parser.getResult();
    const referrer = headersList.get('referer') || null;
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      null;
    const country =
      headersList.get('cf-ipcountry') ||
      headersList.get('x-vercel-ip-country') ||
      null;

    await prisma.click.create({
      data: {
        linkId,
        country,
        device: result.device.type || 'desktop',
        browser: result.browser.name || null,
        os: result.os.name || null,
        referrer,
        ip
      }
    });
  } catch (err) {
    console.error('Click tracking error:', err);
  }
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link || link.banned) notFound();
  if (link.expiresAt && link.expiresAt < new Date()) {
    return <LinkExpired />;
  }

  if (link.password) {
    const cookieStore = await cookies();
    const authed = cookieStore.get(`link_auth_${slug}`)?.value === '1';
    if (!authed) return <PasswordPrompt slug={slug} />;
  }

  const headersList = await headers();
  await trackClick(link.id, headersList);

  try {
    const targetUrl = new URL(link.target);
    if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
      notFound();
    }
  } catch {
    notFound();
  }

  redirect(link.target);
}
