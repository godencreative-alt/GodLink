import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import { AppProvider } from '@/components/providers/app-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getSiteSettings } from '@/lib/site-settings';
import { AdsBanner, AdsHeaderScript } from '@/components/ads/ads-banner';
import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a'
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif'
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  return {
    title: { default: settings.metaTitle, template: `%s — ${settings.siteName}` },
    description: settings.metaDescription,
    keywords: settings.metaKeywords,
    metadataBase: new URL(base),
    alternates: { canonical: '/' },
    icons: { icon: settings.faviconUrl || '/favicon.ico' },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
    },
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      type: 'website',
      url: base,
      siteName: settings.siteName,
      images: settings.ogImage ? [settings.ogImage] : []
    },
    twitter: {
      card: 'summary_large_image',
      site: settings.twitterHandle,
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: settings.ogImage ? [settings.ogImage] : []
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const lang = cookieStore.get('locale')?.value === 'id' ? 'id' : 'en';
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Goden Creative',
    url: base,
    logo: settings.logoUrl || `${base}/logo.png`,
    sameAs: [
      'https://godentopup.com',
      'https://mpwa.godentopup.com',
      'https://tmail.godentopup.com',
      'https://2fa.godentopup.com'
    ]
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: base,
    description: settings.metaDescription
  };

  return (
    <html lang={lang} className={`${inter.variable} ${serif.variable} dark`} suppressHydrationWarning>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <AdsHeaderScript />
        <AppProvider>
          <Navbar
            siteName={settings.siteName}
            siteTagline={settings.siteTagline}
            logoUrl={settings.logoUrl}
            contactEmail={settings.contactEmail}
          />
          <AdsBanner slot="topBanner" className="container mx-auto px-6 py-4" />
          <div className="min-h-screen pt-16">{children}</div>
          <AdsBanner slot="bottomBanner" className="container mx-auto px-6 py-4" />
          <Footer footerText={settings.footerText} contactEmail={settings.contactEmail} />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(228 24% 11%)',
                border: '1px solid hsl(220 14% 18%)',
                color: 'hsl(0 0% 98%)'
              }
            }}
          />
          <AdsBanner slot="popup" />
        </AppProvider>
      </body>
    </html>
  );
}
