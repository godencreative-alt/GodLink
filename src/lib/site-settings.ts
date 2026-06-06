import { prisma } from './prisma';

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  homeBannerUrl: string;
  homeTitle: string;
  homeSubtitle: string;
  homeBadgeText: string;
  loginBannerUrl: string;
  loginTitle: string;
  loginSubtitle: string;
  footerText: string;
  footerLinks: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactWhatsapp: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  socialLinkedin: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  twitterHandle: string;
  primaryColor: string;
  secondaryColor: string;
  adsEnabled: string;
  adsHeaderScript: string;
  adsTopBanner: string;
  adsSidebar: string;
  adsBottomBanner: string;
  adsPopup: string;
};

const defaults: SiteSettings = {
  siteName: 'godl.ink',
  siteTagline: 'by Goden Creative',
  logoUrl: '',
  faviconUrl: '',
  homeBannerUrl: '',
  homeTitle: 'Short links that feel premium, not disposable.',
  homeSubtitle: 'Create, protect, analyze, and share every campaign link from one refined dashboard. Inspired by Kutt, rebuilt for the godl.ink brand.',
  homeBadgeText: 'Powered by Goden Creative',
  loginBannerUrl: '',
  loginTitle: 'Links with signal.',
  loginSubtitle: 'Access your campaigns, analytics, QR codes, and custom domains from a single premium dashboard.',
  footerText: '© {year} Goden Creative. Built for godl.ink.',
  footerLinks: '',
  contactEmail: 'hello@godencreative.com',
  contactPhone: '',
  contactAddress: '',
  contactWhatsapp: '',
  socialInstagram: '',
  socialFacebook: '',
  socialYoutube: '',
  socialLinkedin: '',
  metaTitle: 'godl.ink — Modern URL shortener by Goden Creative',
  metaDescription: 'Short, branded, and analytical links. Built for creators, teams, and modern brands.',
  metaKeywords: 'url shortener, short links, branded links, analytics, qr codes',
  ogImage: '',
  twitterHandle: '',
  primaryColor: '#F5B544',
  secondaryColor: '#8B5CF6',
  adsEnabled: 'true',
  adsHeaderScript: '',
  adsTopBanner: '',
  adsSidebar: '',
  adsBottomBanner: '',
  adsPopup: ''
};

let cachedSettings: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60000;

export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const rows = await prisma.siteSetting.findMany();
    const settings = { ...defaults };

    for (const row of rows) {
      if (row.key in settings) {
        (settings as any)[row.key] = row.value;
      }
    }

    cachedSettings = settings;
    cacheTime = now;
    return settings;
  } catch {
    return defaults;
  }
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  invalidateSiteSettingsCache();
}

export async function setSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const entries = Object.entries(settings).filter(([, v]) => v !== undefined);
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  );
  invalidateSiteSettingsCache();
}

export function getDefaults(): SiteSettings {
  return { ...defaults };
}
