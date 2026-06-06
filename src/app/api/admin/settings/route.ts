import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { getSiteSettings, setSiteSettings, invalidateSiteSettingsCache } from '@/lib/site-settings';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    await setSiteSettings(body);
    invalidateSiteSettingsCache();

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/features');
    revalidatePath('/about');
    revalidatePath('/auth/login');
    revalidatePath('/auth/register');
    revalidatePath('/marketing/pricing');

    const updated = await getSiteSettings();
    return NextResponse.json(updated);
  } catch (e) {
    console.error('Settings update error:', e);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
