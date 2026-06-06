'use client';

import Link from 'next/link';
import { Mail, Github, Twitter } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { translations } from '@/lib/i18n';

interface FooterProps {
  footerText?: string;
  contactEmail?: string;
}

export function Footer({ footerText, contactEmail = 'hello@godencreative.com' }: FooterProps) {
  const { locale } = useApp();
  const t = translations[locale].footer;
  const year = new Date().getFullYear();
  const copyright = (footerText || t.copyright).replace('{year}', String(year));

  const sections = [
    {
      key: 'links',
      title: t.links,
      links: [
        { label: translations[locale].nav.features, href: '/#features' },
        { label: translations[locale].nav.pricing, href: '/marketing/pricing' }
      ]
    },
    {
      key: 'company',
      title: t.company,
      links: [
        { label: locale === 'id' ? 'Tentang' : 'About', href: '/about' },
        { label: t.contact, href: `mailto:${contactEmail}` },
        { label: t.support, href: '/support' }
      ]
    },
    {
      key: 'resources',
      title: t.resources,
      links: [
        { label: t.privacy, href: '/privacy' },
        { label: t.terms, href: '/terms' }
      ]
    }
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                  <path d="M20 24C20 21.7909 21.7909 20 24 20H40C42.2091 20 44 21.7909 44 24V32H36C33.7909 32 32 33.7909 32 36V44H24C21.7909 44 20 42.2091 20 40V24Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none" />
                  <circle cx="38" cy="38" r="4" fill="currentColor" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">godl.ink</p>
                <p className="text-xs text-muted-foreground">by Goden Creative</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Modern URL shortener with analytics, custom domains, and QR codes.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={`mailto:${contactEmail}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}