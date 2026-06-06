'use client';

import { FadeIn } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

export default function TermsPage() {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h1 className="text-5xl font-black tracking-tight">{id ? 'Syarat Layanan' : 'Terms of Service'}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{id ? 'Terakhir diperbarui: 17 Mei 2026' : 'Last updated: May 17, 2026'}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="prose prose-invert mt-10 max-w-none">
          <h2 className="text-2xl font-bold">{id ? 'Persetujuan atas Syarat' : 'Agreement to Terms'}</h2>
          <p className="text-muted-foreground">
            {id ? 'Dengan mengakses godl.ink, Anda setuju terikat oleh syarat layanan ini dan kebijakan privasi kami.' : 'By accessing godl.ink, you agree to be bound by these Terms of Service and our Privacy Policy.'}
          </p>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Deskripsi Layanan' : 'Service Description'}</h2>
          <p className="text-muted-foreground">
            {id ? 'godl.ink menyediakan shortlink, analitik, QR code, domain kustom, dan akses API. Kami berhak mengubah atau menghentikan layanan kapan saja.' : 'godl.ink provides URL shortening, analytics, QR code generation, custom domains, and API access. We reserve the right to modify or discontinue any part of the service at any time.'}
          </p>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Pendaftaran Akun' : 'Account Registration'}</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            {(id ? ['Anda harus memberikan informasi yang akurat dan lengkap', 'Anda bertanggung jawab menjaga keamanan akun', 'Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini', 'Satu orang atau entitas tidak boleh memiliki banyak akun gratis'] : ['You must provide accurate and complete information', 'You are responsible for maintaining the security of your account', 'You must be at least 13 years old to use this service', 'One person or entity may not maintain multiple free accounts']).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Penggunaan yang Diperbolehkan' : 'Acceptable Use'}</h2>
          <p className="text-muted-foreground">{id ? 'Anda setuju untuk TIDAK menggunakan godl.ink untuk:' : 'You agree NOT to use godl.ink to:'}</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            {(id ? ['Memendekkan URL menuju konten ilegal, malware, phishing, atau spam', 'Melanggar hak kekayaan intelektual', 'Melecehkan, menyalahgunakan, atau merugikan orang lain', 'Melewati batas rate limit atau menyalahgunakan API', 'Menyamar sebagai pihak lain atau memalsukan afiliasi', 'Mengganggu layanan'] : ['Shorten URLs that link to illegal content, malware, phishing, or spam', 'Violate intellectual property rights', 'Harass, abuse, or harm others', 'Circumvent rate limits or abuse the API', 'Impersonate others or misrepresent your affiliation', 'Interfere with or disrupt the service']).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Paket dan Penagihan' : 'Plans and Billing'}</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            {(id ? ['Paket gratis disediakan apa adanya tanpa jaminan uptime', 'Paket berbayar ditagihkan bulanan atau tahunan di muka', 'Refund diberikan sesuai kebijakan kami', 'Harga dapat berubah dengan pemberitahuan 30 hari'] : ['Free plans are provided as-is with no uptime guarantee', 'Paid plans are billed monthly or annually in advance', 'Refunds are provided at our discretion', 'We may change pricing with 30 days notice']).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Kontak' : 'Contact'}</h2>
          <p className="text-muted-foreground">
            {id ? 'Pertanyaan tentang syarat ini? Hubungi kami di ' : 'Questions about these Terms? Contact us at '}<a href="mailto:hello@godencreative.com" className="text-primary hover:underline">hello@godencreative.com</a>
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
