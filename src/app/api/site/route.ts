import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';

// Public endpoint — returns only the fields safe to expose to unauthenticated visitors.
// Never add ad scripts, contact details, or social tokens here.
export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json({
    siteName: s.siteName,
    siteTagline: s.siteTagline,
    logoUrl: s.logoUrl,
    homeTitle: s.homeTitle,
    homeSubtitle: s.homeSubtitle,
    homeBadgeText: s.homeBadgeText,
    homeBannerUrl: s.homeBannerUrl,
    loginTitle: s.loginTitle,
    loginSubtitle: s.loginSubtitle,
    loginBannerUrl: s.loginBannerUrl,
    footerText: s.footerText,
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription
  });
}
